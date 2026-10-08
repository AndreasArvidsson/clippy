import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { enrichClipItem } from "../enrichClipItem";
import { Mime } from "../Mime";
import type { ClipBookmark, ClipFormat, ClipItemType } from "../types/types";
import { createHash } from "../util/createHash";

function hashFormats(
    type: ClipItemType,
    formats: ClipFormat[],
    bookmark?: ClipBookmark,
): string {
    return enrichClipItem({
        version: 1,
        id: "test",
        created: 0,
        type,
        name: undefined,
        list: undefined,
        entries: [{ formats, bookmark }],
    }).hash;
}

function hashContent(type: ClipItemType, data: string): string {
    return hashFormats(type, [
        {
            mime: type === "image" ? Mime.imagePng : Mime.textPlain,
            encoding: type === "image" ? "base64" : "utf8",
            data,
        },
    ]);
}

suite("Clipboard content hashes", () => {
    test("different primary content changes the hash", () => {
        for (const type of ["text", "image"] as const) {
            assert.notEqual(
                hashContent(type, "AAAA"),
                hashContent(type, "BBBB"),
            );
        }
    });

    test("restored text matches after application metadata is lost", () => {
        const text: ClipFormat = {
            mime: Mime.textPlain,
            encoding: "utf8",
            data: "runAllTests",
        };
        const metadata: ClipFormat = {
            mime: 'electron application/osclipboard;format="Chromium Web Custom MIME Data Format"',
            encoding: "base64",
            data: Buffer.from("editor metadata").toString("base64"),
        };
        const html: ClipFormat = {
            mime: Mime.textHtml,
            encoding: "utf8",
            data: "<b>runAllTests</b>",
        };
        const originalHash = hashFormats("text", [metadata, html, text]);

        assert.equal(originalHash, hashFormats("text", [text]));
        assert.equal(
            originalHash,
            hashFormats("text", [text, html, { ...metadata, data: "changed" }]),
        );
    });

    test("restored images match after native metadata changes", () => {
        const image: ClipFormat = {
            mime: Mime.imagePng,
            encoding: "base64",
            data: Buffer.from("image payload").toString("base64"),
        };
        const metadata: ClipFormat = {
            mime: 'electron application/osclipboard;format="DataObject"',
            encoding: "base64",
            data: "HAyKAAAAAAA=",
        };
        const html: ClipFormat = {
            mime: Mime.textHtml,
            encoding: "utf8",
            data: '<img src="original.png" alt="original">',
        };
        const originalHash = hashFormats("image", [image, metadata, html]);

        assert.equal(originalHash, hashFormats("image", [image]));
        assert.equal(
            originalHash,
            hashFormats("image", [
                image,
                { ...metadata, data: "AAAAAAAAAAA=" },
                { ...html, data: '<img src="changed.png" alt="changed">' },
            ]),
        );
    });

    test("decoded text hashes identically across storage encodings", () => {
        const data = "Clipboard text: åäö";
        assert.equal(
            hashContent("text", data),
            hashFormats("text", [
                {
                    mime: Mime.textPlain,
                    encoding: "base64",
                    data: Buffer.from(data).toString("base64"),
                },
            ]),
        );
    });

    test("text formats provide a fallback when plain text is absent", () => {
        for (const mime of [Mime.textRtf, Mime.textHtml]) {
            assert.equal(
                hashFormats("text", [
                    { mime, encoding: "utf8", data: "fallback" },
                ]),
                hashContent("text", "fallback"),
            );
        }
    });

    test("bookmark metadata does not change the primary text hash", () => {
        const text: ClipFormat = {
            mime: Mime.textPlain,
            encoding: "utf8",
            data: "https://example.com",
        };
        const bookmark: ClipBookmark = {
            mime: Mime.electronBookmark,
            title: "Example",
            url: text.data,
        };
        const hash = hashFormats("text", [text], bookmark);

        assert.equal(hash, hashFormats("text", [text]));
        assert.equal(
            hash,
            hashFormats("text", [text], { ...bookmark, title: "Changed" }),
        );
    });

    test("only length and the first and last 30 characters are sampled", () => {
        const data = "A".repeat(30) + "B".repeat(100) + "C".repeat(30);

        for (const type of ["text", "image"] as const) {
            const hash = hashContent(type, data);
            assert.equal(hash, hashContent(type, data.replace("B", "D")));
            assert.notEqual(
                hash,
                hashContent(type, `${data.slice(0, 29)}D${data.slice(30)}`),
            );
            assert.equal(
                hash,
                hashContent(type, `${data.slice(0, -31)}D${data.slice(-30)}`),
            );
            assert.notEqual(
                hash,
                hashContent(type, `${data.slice(0, -30)}D${data.slice(-29)}`),
            );
            assert.notEqual(
                hash,
                hashContent(type, `${data.slice(0, 64)}BBBB${data.slice(64)}`),
            );
        }
    });

    test("payloads up to 64 characters are hashed whole", () => {
        for (const type of ["text", "image"] as const) {
            for (const length of [0, 1, 32, 63, 64]) {
                const data = "A".repeat(length);
                assert.equal(hashContent(type, data), createHash(data));
            }
        }
    });

    test("sampling starts at 65 characters", () => {
        const prefix = "A".repeat(30);
        const suffix = "C".repeat(30);
        const whole = `${prefix}BBBB${suffix}`;
        const sampled = `${prefix}BBBBB${suffix}`;

        for (const type of ["text", "image"] as const) {
            assert.notEqual(
                hashContent(type, whole),
                hashContent(type, whole.replace("B", "D")),
            );
            assert.equal(
                hashContent(type, sampled),
                hashContent(type, sampled.replace("B", "D")),
            );
            assert.equal(
                hashContent(type, sampled),
                createHash(`${prefix}.65.${suffix}`),
            );
        }
    });
});
