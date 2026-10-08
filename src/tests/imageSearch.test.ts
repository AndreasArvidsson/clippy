import assert from "node:assert/strict";
import { enrichClipItem } from "../enrichClipItem";
import { Mime } from "../Mime";
import type { ClipFormat, ClipItem, Search } from "../types/types";
import type * as FilterItemsModule from "../util/filterItems";
import type * as ProcessTargetsModule from "../util/processTargets";
import { loadMocked } from "./helpers/loadMocked";

function image(
    text: string,
    alt?: string,
    encoding: ClipFormat["encoding"] = "utf8",
): ClipItem {
    const formats: ClipFormat[] = [
        { mime: Mime.imagePng, encoding: "base64", data: "AAECAw==" },
        {
            mime: Mime.textPlain,
            encoding,
            data:
                encoding === "base64"
                    ? Buffer.from(text, "utf8").toString("base64")
                    : text,
        },
    ];
    if (alt != null) {
        formats.push({
            mime: Mime.textHtml,
            encoding: "utf8",
            data: `<img src="chart.png" alt="${alt}">`,
        });
    }

    return enrichClipItem({
        version: 1,
        id: "image",
        created: 123,
        type: "image",
        name: undefined,
        list: undefined,
        entries: [{ formats, bookmark: undefined }],
    });
}

function loadFilters(items: ClipItem[], search: Search) {
    return loadMocked<typeof FilterItemsModule>("../../util/filterItems.ts", {
        "../storage": {
            storage: {
                getClipboardItems: () => items,
                getConfig: () => ({ activeList: "all" }),
                getSearch: () => search,
            },
        },
    });
}

function loadTargets(items: ClipItem[]) {
    return loadMocked<typeof ProcessTargetsModule>(
        "../../util/processTargets.ts",
        {
            "../window": { isWindowVisible: () => false },
            "./filterItems": loadFilters(items, { show: false }),
        },
    );
}

suite("Image accompanying-text search", () => {
    for (const encoding of ["utf8", "base64"] as const) {
        test(`UI search matches ${encoding} text accompanying an unnamed image`, () => {
            const item = image("Quarterly budget", undefined, encoding);
            const { applySearchFilters } = loadFilters([item], {
                show: true,
                text: "BUDGET",
            });
            assert.deepEqual(applySearchFilters([item], true), [item]);
        });
    }

    test("UI search still matches image alt independently of plain text", () => {
        const item = image("Quarterly budget", "Revenue chart");
        const { applySearchFilters } = loadFilters([item], {
            show: true,
            text: "chart",
        });
        assert.deepEqual(applySearchFilters([item], true), [item]);
    });

    test("UI text-type filter excludes an image with matching plain text", () => {
        const item = image("Quarterly budget");
        const { applySearchFilters } = loadFilters([item], {
            show: true,
            type: "text",
            text: "budget",
        });
        assert.deepEqual(applySearchFilters([item], true), []);
    });

    test("RPC image target matches accompanying plain text", () => {
        const item = image("Quarterly budget");
        const { processTargets } = loadTargets([item]);
        assert.deepEqual(
            processTargets([
                {
                    type: "search",
                    itemType: "image",
                    itemText: "quarterly budget",
                    offset: 0,
                },
            ]),
            [item],
        );
    });

    test("RPC URL target matches URL text accompanying an image", () => {
        const item = image("https://example.com/chart.png");
        const { processTargets } = loadTargets([item]);
        assert.deepEqual(
            processTargets([{ type: "search", itemType: "url", offset: 0 }]),
            [item],
        );
    });

    test("RPC text-type target excludes an image with matching plain text", () => {
        const item = image("Quarterly budget");
        const { processTargets } = loadTargets([item]);
        assert.throws(
            () =>
                processTargets([
                    {
                        type: "search",
                        itemType: "text",
                        itemText: "budget",
                        offset: 0,
                    },
                ]),
            /No matching item found/u,
        );
    });
});
