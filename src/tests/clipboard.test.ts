import assert from "node:assert/strict";
import { setImmediate } from "node:timers/promises";
import type * as ClipboardModule from "../clipboard";
import { enrichClipItem } from "../enrichClipItem";
import { Mime } from "../Mime";
import type { ClipItem } from "../types/types";
import { loadMocked } from "./helpers/loadMocked";

interface ClipboardEntry {
    types: string[];
    getType: (type: string) => Promise<Blob>;
}

const excludedFormat =
    'electron application/osclipboard;format="ExcludeClipboardContentFromMonitorProcessing"';

function deferred<T>() {
    let resolvePromise!: (value: T) => void;
    let rejectPromise!: (reason: Error) => void;
    const promise = new Promise<T>((resolve, reject) => {
        resolvePromise = resolve;
        rejectPromise = reject;
    });
    return { promise, resolve: resolvePromise, reject: rejectPromise };
}

function createHarness(listener?: () => void) {
    let change!: () => void;
    let now = 1000;
    let readResult: Promise<ClipboardEntry[]> = Promise.resolve([
        textEntry("initial"),
    ]);
    const received: { item: ClipItem; excludedAt: number | undefined }[] = [];
    const errors: unknown[] = [];
    const originalNow = Date.now;
    Date.now = () => now;
    const { clipboard } = loadMocked<typeof ClipboardModule>(
        "../../clipboard.ts",
        {
            "clipboard-event": {
                startListening() {
                    /* No native watcher is needed in this test. */
                },
                on(_event: string, callback: () => void) {
                    change = callback;
                },
            },
            electron: { clipboard: { read: () => readResult } },
            "./storage": { storage: { getConfig: () => ({ paused: false }) } },
            "./util/notifications": {
                showErrorNotification(_message: string, error: unknown) {
                    errors.push(error);
                },
            },
            "./enrichClipItem": { enrichClipItem },
        },
    );
    clipboard.onChange((item, excludedAt) => {
        received.push({ item, excludedAt });
        listener?.();
    });
    return {
        received,
        errors,
        emit(timestamp: number, result: typeof readResult) {
            now = timestamp;
            readResult = result;
            change();
        },
        advanceTo(timestamp: number) {
            now = timestamp;
        },
        restore() {
            Date.now = originalNow;
        },
    };
}

function textEntry(text: string) {
    return {
        types: [Mime.textPlain],
        getType: () => Promise.resolve(new Blob([text])),
    };
}

suite("Clipboard event processing", () => {
    test("a slow read retains the event timestamp", async () => {
        const harness = createHarness();
        const payload = deferred<Blob>();
        try {
            harness.emit(
                4000,
                Promise.resolve([
                    {
                        types: [Mime.textPlain],
                        getType: () => payload.promise,
                    },
                ]),
            );
            await setImmediate();
            harness.advanceTo(4500);
            payload.resolve(new Blob(["delayed content"]));
            await setImmediate();
            assert.equal(harness.received.length, 1);
            assert.equal(harness.received[0].item.created, 4000);
        } finally {
            harness.restore();
        }
    });

    test("a delayed exclusion is processed before its faster restoration", async () => {
        const harness = createHarness();
        const excluded = deferred<Blob>();
        try {
            harness.emit(
                1000,
                Promise.resolve([
                    {
                        types: [Mime.textPlain, excludedFormat],
                        getType: () => excluded.promise,
                    },
                ]),
            );
            harness.emit(1100, Promise.resolve([textEntry("restored")]));
            await setImmediate();
            assert.equal(harness.received.length, 0);
            excluded.resolve(new Blob(["temporary"]));
            await setImmediate();
            assert.equal(harness.received.length, 1);
            assert.equal(harness.received[0].item.created, 1100);
            assert.equal(harness.received[0].excludedAt, 1000);
            harness.emit(1200, Promise.resolve([textEntry("next")]));
            await setImmediate();
            assert.equal(harness.received[1].excludedAt, undefined);
        } finally {
            harness.restore();
        }
    });

    test("a newer exclusion prevents an interrupted live capture from being delivered", async () => {
        const harness = createHarness();
        const firstBytes = deferred<ArrayBuffer>();
        let firstRead = true;
        let liveClipboard: Record<string, string> = {
            [Mime.textPlain]: "public A",
            [Mime.textHtml]: "<b>public A</b>",
        };
        const liveEntry: ClipboardEntry = {
            types: [Mime.textPlain, Mime.textHtml],
            getType(type) {
                const data = new Blob([liveClipboard[type]]);
                if (firstRead) {
                    firstRead = false;
                    data.arrayBuffer = () => firstBytes.promise;
                }
                return Promise.resolve(data);
            },
        };
        try {
            harness.emit(1000, Promise.resolve([liveEntry]));
            await setImmediate();
            liveClipboard = {
                [Mime.textPlain]: "secret B",
                [Mime.textHtml]: "<b>secret B</b>",
            };
            harness.emit(
                1100,
                Promise.resolve([
                    {
                        ...liveEntry,
                        types: [...liveEntry.types, excludedFormat],
                    },
                ]),
            );
            firstBytes.resolve(await new Blob(["public A"]).arrayBuffer());
            await setImmediate();
            assert.equal(harness.received.length, 0);
            assert.deepEqual(harness.errors, []);
            harness.emit(1200, Promise.resolve([textEntry("stable C")]));
            await setImmediate();
            assert.equal(harness.received.length, 1);
            assert.equal(harness.received[0].item.text, "stable C");
            assert.equal(harness.received[0].excludedAt, 1100);
        } finally {
            harness.restore();
        }
    });

    test("a failed read does not stop later updates", async () => {
        const harness = createHarness();
        const failed = deferred<ReturnType<typeof textEntry>[]>();
        const error = new Error("read failed");
        try {
            harness.emit(2000, failed.promise);
            harness.emit(2100, Promise.resolve([textEntry("next")]));
            failed.reject(error);
            await setImmediate();
            assert.deepEqual(harness.errors, [error]);
            assert.equal(harness.received.length, 1);
            assert.equal(harness.received[0].item.created, 2100);
        } finally {
            harness.restore();
        }
    });

    test("a thrown listener does not stop later updates", async () => {
        const error = new Error("listener failed");
        let calls = 0;
        const harness = createHarness(() => {
            if (++calls === 1) {
                throw error;
            }
        });
        try {
            harness.emit(3000, Promise.resolve([textEntry("first")]));
            await setImmediate();
            harness.emit(3100, Promise.resolve([textEntry("second")]));
            await setImmediate();
            assert.deepEqual(harness.errors, [error]);
            assert.equal(calls, 2);
            harness.emit(3200, Promise.resolve([textEntry("third")]));
            await setImmediate();
            assert.equal(calls, 3);
        } finally {
            harness.restore();
        }
    });
});
