import * as assert from "node:assert/strict";
import { hintToIndex, indexToHint } from "../common/hints";

suite("Hints", () => {
    test("indexToHint", () => {
        assert.equal(indexToHint(0), "1");
        assert.equal(indexToHint(8), "9");
        assert.equal(indexToHint(9), "A");
        assert.equal(indexToHint(34), "Z");
        assert.equal(indexToHint(35), "AA");
        assert.equal(indexToHint(60), "AZ");
        assert.equal(indexToHint(61), "BA");
        assert.equal(indexToHint(710), "ZZ");
        assert.equal(indexToHint(711), "AAA");
    });

    test("hintToIndex", () => {
        assert.equal(hintToIndex("1"), 0);
        assert.equal(hintToIndex("9"), 8);
        assert.equal(hintToIndex("A"), 9);
        assert.equal(hintToIndex("Z"), 34);
        assert.equal(hintToIndex("AA"), 35);
        assert.equal(hintToIndex("AZ"), 60);
        assert.equal(hintToIndex("BA"), 61);
        assert.equal(hintToIndex("ZZ"), 710);
        assert.equal(hintToIndex("AAA"), 711);

        assert.throws(() => hintToIndex(""), /Invalid hint/u);
        assert.throws(() => hintToIndex(" "), /Invalid hint/u);
        assert.throws(() => hintToIndex("1a"), /Invalid hint/u);
        assert.throws(() => hintToIndex("a1"), /Invalid hint/u);
        assert.throws(() => hintToIndex("@"), /Invalid hint/u);
    });
});
