import * as path from "node:path";
import { exit } from "node:process";
import fg from "fast-glob";
import Mocha from "mocha";

const mocha = new Mocha({
    ui: "tdd",
    color: true,
});

const cwd = path.resolve(__dirname);
const files = fg.sync(["*.test.ts"], { cwd }).toSorted();

if (files.length === 0) {
    console.error("No test files found.");
    exit(1);
}

files.forEach((f) => mocha.addFile(path.resolve(cwd, f)));

mocha.run((failures) => {
    if (failures > 0) {
        exit(1);
    }
});
