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

export function registerClipProtocol() {
    protocol.handle("clip", async (req): Promise<Response> => {
        // clip://image/<id>
        const url = new URL(req.url);
        const kind = url.hostname;
        const id = url.pathname.slice(1); // remove leading /

        if (kind !== "image" || !id) {
            return new Response("Not Found", { status: 404 });
        }

        const item = storage.getClipboardItem(id);

        if (item?.image == null) {
            return new Response("Not Found", { status: 404 });
        }

        const parsed = parseDataUrl(item.image.data);

        if (parsed == null) {
            return new Response("Unsupported Media", { status: 415 });
        }

        const thumb = await createThumbnail(parsed.buf);

        return new Response(thumb.buf, {
            headers: {
                "content-type": thumb.mime,
                "cache-control": "public, max-age=31536000, immutable",
            },
        });
    });
}

function parseDataUrl(dataUrl: string): { mime: string; buf: Buffer } | null {
    const m = /^data:([^;]+);base64,(.+)$/i.exec(dataUrl);
    if (m == null) {
        return null;
    }
    return {
        mime: m[1],
        buf: Buffer.from(m[2], "base64"),
    };
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
            compressionLevel: 9, // max zlib compression
            quality: 50, // libimagequant quality (0–100)
            colors: 128, // try 64–128; lower -> smaller
        })
        .toBuffer();

    return {
        buf,
        mime: "image/png",
    };
}
