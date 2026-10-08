import assert from "node:assert/strict";
import sharp from "sharp";
import { enrichClipItem } from "../enrichClipItem";
import { Mime } from "../Mime";
import type { ClipItemImage } from "../types/types";
import type * as ImagePixelModule from "../util/haveSameImagePixels";
import { loadMocked } from "./helpers/loadMocked";

function image(data: Buffer): ClipItemImage {
    const item = enrichClipItem({
        version: 1,
        id: "test",
        created: 0,
        type: "image",
        name: undefined,
        list: undefined,
        entries: [
            {
                formats: [
                    {
                        mime: Mime.imagePng,
                        encoding: "base64",
                        data: data.toString("base64"),
                    },
                ],
                bookmark: undefined,
            },
        ],
    });
    assert.equal(item.type, "image");
    return item;
}

suite("Image pixel comparison", () => {
    test("compares decoded pixels across PNG encodings and rejects invalid images", async () => {
        const pixels = Buffer.from([
            255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 255, 255, 255, 255,
        ]);
        const raw = { width: 2, height: 2, channels: 4 as const };
        const first = await sharp(pixels, { raw })
            .png({ compressionLevel: 0 })
            .toBuffer();
        const reencoded = await sharp(pixels, { raw })
            .png({ compressionLevel: 9 })
            .toBuffer();
        assert.notDeepEqual(first, reencoded);
        const changedPixels = Buffer.from(pixels);
        changedPixels[0] = 254;
        const changed = await sharp(changedPixels, { raw }).png().toBuffer();
        const differentSize = await sharp(pixels, {
            raw: { ...raw, width: 1, height: 4 },
        })
            .png()
            .toBuffer();
        const decoded = new Map<
            string,
            { width: number; height: number; data: Buffer }
        >();
        for (const png of [first, reencoded, changed, differentSize]) {
            const { data, info } = await sharp(png)
                .ensureAlpha()
                .raw()
                .toBuffer({ resolveWithObject: true });
            decoded.set(png.toString("base64"), {
                width: info.width,
                height: info.height,
                data,
            });
        }
        // Node cannot load Electron's nativeImage. Sharp decodes real fixtures;
        // this adapter exercises the comparison using the same size/bitmap API.
        const { haveSameImagePixels } = loadMocked<typeof ImagePixelModule>(
            "../../util/haveSameImagePixels.ts",
            {
                electron: {
                    nativeImage: {
                        createFromBuffer(buffer: Buffer) {
                            const value = decoded.get(
                                buffer.toString("base64"),
                            );
                            return {
                                isEmpty: () => value == null,
                                getSize: () => ({
                                    width: value?.width ?? 0,
                                    height: value?.height ?? 0,
                                }),
                                toBitmap: () => value?.data ?? Buffer.alloc(0),
                            };
                        },
                    },
                },
            },
        );
        assert.equal(haveSameImagePixels(image(first), image(reencoded)), true);
        assert.equal(haveSameImagePixels(image(first), image(changed)), false);
        assert.equal(
            haveSameImagePixels(image(first), image(differentSize)),
            false,
        );
        const invalid = image(Buffer.from("invalid PNG"));
        assert.equal(haveSameImagePixels(image(first), invalid), false);
        assert.equal(haveSameImagePixels(invalid, image(first)), false);
        assert.equal(haveSameImagePixels(invalid, invalid), false);
    });
});
