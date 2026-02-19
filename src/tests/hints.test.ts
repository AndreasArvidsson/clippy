import * as assert from "assert";
import { hintToIndex, indexToHint } from "../common/hints";

suite("Hints", () => {
    test("indexToHint", () => {
        assert.strictEqual(indexToHint(0), "1");
        assert.strictEqual(indexToHint(8), "9");
        assert.strictEqual(indexToHint(9), "A");
        assert.strictEqual(indexToHint(34), "Z");
        assert.strictEqual(indexToHint(35), "AA");
        assert.strictEqual(indexToHint(60), "AZ");
        assert.strictEqual(indexToHint(61), "BA");
        assert.strictEqual(indexToHint(710), "ZZ");
        assert.strictEqual(indexToHint(711), "AAA");
    });

    test("hintToIndex", () => {
        assert.strictEqual(hintToIndex("1"), 0);
        assert.strictEqual(hintToIndex("9"), 8);
        assert.strictEqual(hintToIndex("A"), 9);
        assert.strictEqual(hintToIndex("Z"), 34);
        assert.strictEqual(hintToIndex("AA"), 35);
        assert.strictEqual(hintToIndex("AZ"), 60);
        assert.strictEqual(hintToIndex("BA"), 61);
        assert.strictEqual(hintToIndex("ZZ"), 710);
        assert.strictEqual(hintToIndex("AAA"), 711);

        assert.throws(() => hintToIndex(""), /Invalid hint/);
        assert.throws(() => hintToIndex(" "), /Invalid hint/);
        assert.throws(() => hintToIndex("1a"), /Invalid hint/);
        assert.throws(() => hintToIndex("a1"), /Invalid hint/);
        assert.throws(() => hintToIndex("@"), /Invalid hint/);
    });
});
