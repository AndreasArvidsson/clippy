import { globSync } from "glob";
import { createJiti } from "jiti";
import Mocha from "mocha";
import * as path from "node:path";

const mocha = new Mocha({
    ui: "tdd",
    color: true,
});

const cwd = path.resolve(__dirname);
const jiti = createJiti(__filename);
const files = globSync(["*.test.ts"], { cwd }).sort();

async function loadTestFile(file: string): Promise<void> {
    const absolutePath = path.resolve(cwd, file);
    mocha.suite.emit("pre-require", globalThis, absolutePath, mocha);
    const testModule = await jiti.import(absolutePath);
    mocha.suite.emit("require", testModule, absolutePath, mocha);
    mocha.suite.emit("post-require", globalThis, absolutePath, mocha);
}

void (async () => {
    for (const file of files) {
        await loadTestFile(file);
    }

    // Run the mocha test
    mocha.run((failures) => {
        if (failures > 0) {
            process.exit(1);
        }
    });
})();
