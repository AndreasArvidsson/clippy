import assert from "node:assert/strict";
import { Mime } from "../Mime";
import type { ClipItemV0 } from "../types/v0/typesV0";
import { upgradeClipItem } from "../upgradeClipItem";
import { getItemToStore } from "../util/getItemToStore";

function legacyItem(overrides: Partial<ClipItemV0> = {}): ClipItemV0 {
    return {
        id: "123",
        created: 123,
        hash: "legacy hash",
        type: "text",
        name: "Saved item",
        list: "starred",
        text: "plain text",
        rtf: "{\\rtf1 plain text}",
        html: "<b>plain text</b>",
        bookmark: { title: "Bookmark", url: "https://example.com" },
        image: undefined,
        ...overrides,
    };
}

suite("Clipboard storage migration", () => {
    test("legacy text retains all formats, bookmark and user metadata", () => {
        const original = legacyItem();
        const upgraded = upgradeClipItem(original);
        assert.equal(upgraded.version, 1);
        assert.equal(upgraded.id, original.id);
        assert.equal(upgraded.created, original.created);
        assert.equal(upgraded.name, original.name);
        assert.equal(upgraded.list, original.list);
        assert.equal(upgraded.type, "text");
        assert.equal(upgraded.text, original.text);
        assert.notEqual(upgraded.hash, original.hash);
        assert.deepEqual(upgraded.entries, [
            {
                formats: [
                    {
                        mime: Mime.textPlain,
                        encoding: "utf8",
                        data: original.text,
                    },
                    {
                        mime: Mime.textRtf,
                        encoding: "utf8",
                        data: original.rtf,
                    },
                    {
                        mime: Mime.textHtml,
                        encoding: "utf8",
                        data: original.html,
                    },
                ],
                bookmark: { mime: Mime.electronBookmark, ...original.bookmark },
            },
        ]);
    });

    test("legacy image data URLs retain image bytes and HTML attributes", () => {
        const payload = "AAECAw==";
        const upgraded = upgradeClipItem(
            legacyItem({
                type: "image",
                html: '<img src="original.png" alt="Screenshot">',
                image: {
                    data: `data:image/png;base64,${payload}`,
                    src: "original.png",
                    alt: "Screenshot",
                },
            }),
        );
        assert.equal(upgraded.type, "image");
        assert.equal(upgraded.text, "plain text");
        assert.deepEqual(upgraded.image, {
            mime: Mime.imagePng,
            encoding: "base64",
            data: payload,
        });
        assert.equal(upgraded.src, "original.png");
        assert.equal(upgraded.alt, "Screenshot");
    });

    test("saving excludes derived fields and reloads equivalent text and image items", () => {
        const items = [
            upgradeClipItem(legacyItem()),
            upgradeClipItem(
                legacyItem({
                    type: "image",
                    image: {
                        data: "data:image/png;base64,AAECAw==",
                        src: undefined,
                        alt: undefined,
                    },
                }),
            ),
        ];
        for (const item of items) {
            const stored = getItemToStore(item);
            assert.deepEqual(
                Object.keys(stored).toSorted(),
                [
                    "version",
                    "id",
                    "created",
                    "type",
                    "name",
                    "list",
                    "entries",
                ].toSorted(),
            );
            assert.deepEqual(stored.entries, item.entries);
            assert.deepEqual(upgradeClipItem(stored), item);
        }
    });
});
