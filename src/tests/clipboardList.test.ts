import assert from "node:assert/strict";
import type * as ClipboardListModule from "../clipboardList";
import { enrichClipItem } from "../enrichClipItem";
import { Mime } from "../Mime";
import type { ClipItem } from "../types/types";
import { loadMocked } from "./helpers/loadMocked";

function image(created: number, data: string): ClipItem {
    return enrichClipItem({
        version: 1,
        id: String(created),
        created,
        type: "image",
        name: undefined,
        list: undefined,
        entries: [
            {
                formats: [{ mime: Mime.imagePng, encoding: "base64", data }],
                bookmark: undefined,
            },
        ],
    });
}

suite("Clipboard restoration detection", () => {
    for (const [elapsed, shouldCompare] of [
        [100, true],
        [299, true],
        [300, false],
        [301, false],
    ] as const) {
        test(`restoration ${elapsed}ms after exclusion uses event time despite delayed processing`, () => {
            let receive!: (item: ClipItem, excludedAt?: number) => void;
            const added: ClipItem[] = [];
            let comparisons = 0;
            let notifications = 0;
            const previous = image(900, "original PNG");
            const { onChange } = loadMocked<typeof ClipboardListModule>(
                "../../clipboardList.ts",
                {
                    "./clipboard": {
                        clipboard: {
                            onChange(callback: typeof receive) {
                                receive = callback;
                            },
                        },
                    },
                    "./storage": {
                        storage: {
                            getClipboardItems: () => [previous],
                            getConfig: () => ({ autoStar: false }),
                            addNewItem(item: ClipItem) {
                                added.push(item);
                            },
                        },
                    },
                    "./util/haveSameImagePixels": {
                        haveSameImagePixels() {
                            comparisons++;
                            return true;
                        },
                    },
                },
            );
            onChange(() => {
                notifications++;
            });
            const originalNow = Date.now;
            Date.now = () => 2000;
            try {
                receive(image(1000 + elapsed, "reencoded PNG"), 1000);
                assert.equal(comparisons, shouldCompare ? 1 : 0);
                assert.equal(added.length, shouldCompare ? 0 : 1);
                assert.equal(notifications, shouldCompare ? 0 : 1);
            } finally {
                Date.now = originalNow;
            }
        });
    }

    test("ordinary image updates do not invoke pixel comparison", () => {
        let receive!: (item: ClipItem, excludedAt?: number) => void;
        const added: ClipItem[] = [];
        const previous = image(1000, "original PNG");
        const { onChange } = loadMocked<typeof ClipboardListModule>(
            "../../clipboardList.ts",
            {
                "./clipboard": {
                    clipboard: {
                        onChange(callback: typeof receive) {
                            receive = callback;
                        },
                    },
                },
                "./storage": {
                    storage: {
                        getClipboardItems: () => [previous],
                        getConfig: () => ({ autoStar: false }),
                        addNewItem(item: ClipItem) {
                            added.push(item);
                        },
                    },
                },
                "./util/haveSameImagePixels": {
                    haveSameImagePixels() {
                        assert.fail("Unexpected pixel comparison");
                    },
                },
            },
        );
        onChange(() => {
            /* This test only inspects stored items. */
        });
        receive(image(1100, "different PNG"));
        assert.equal(added.length, 1);
        receive(image(1200, "original PNG"));
        assert.equal(added.length, 1);
    });
});
