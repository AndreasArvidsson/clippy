import { protocol } from "electron";
import sharp from "sharp";
import { storage } from "./storage";

protocol.registerSchemesAsPrivileged([
    {
        scheme: "clip",
        privileges: {
            standard: true,
            secure: true,
            corsEnabled: true,
            supportFetchAPI: true,
        },
    },
]);

export function registerClipProtocol(): void {
    protocol.handle("clip", async (req): Promise<Response> => {
        // clip://image/<id>
        const url = new URL(req.url);
        const kind = url.hostname;
        // remove leading /
        const id = url.pathname.slice(1);

        if (kind !== "image" || !id) {
            return new Response("Not Found", { status: 404 });
        }

        const item = storage.getClipboardItem(id);
        const image = item?.type === "image" ? item.image : undefined;

        if (image == null) {
            return new Response("Not Found", { status: 404 });
        }

        const buf = Buffer.from(image.data, image.encoding);
        const thumb = await createThumbnail(buf);

        return new Response(thumb.buf, {
            headers: {
                "content-type": thumb.mime,
                "cache-control": "public, max-age=31536000, immutable",
            },
        });
    });
}

export async function createThumbnail(
    input: Buffer,
): Promise<{ buf: Buffer; mime: string }> {
    const HEIGHT = 256;

    const img = sharp(input, { failOn: "none" })
        // Auto-rotate based on EXIF data
        .rotate()
        // Resize by height, keep aspect, never upscale
        .resize({
            height: HEIGHT,
            fit: "inside",
            withoutEnlargement: true,
        });

    // Paletted PNG (quantized)
    const buf = await img
        .png({
            palette: true,
            // max zlib compression
            compressionLevel: 9,
            // libimagequant quality (0–100)
            quality: 50,
            // try 64–128; lower -> smaller
            colors: 128,
        })
        .toBuffer();

    return {
        buf,
        mime: "image/png",
    };
}
