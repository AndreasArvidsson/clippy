import * as fs from "node:fs";
import * as fsPromises from "node:fs/promises";

export async function readJsonFile<T>(path: string): Promise<T> {
    const data = await fsPromises.readFile(path, "utf8");
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    return JSON.parse(data) as T;
}

export function writeJsonFile(path: string, data: unknown): Promise<void> {
    const json = JSON.stringify(data, null, 4);
    return fsPromises.writeFile(path, json, "utf8");
}

export async function makeDirs(path: string): Promise<void> {
    await fsPromises.mkdir(path, { recursive: true });
}

export function getFilesInFolder(path: string): Promise<string[]> {
    return fsPromises.readdir(path);
}

export function deleteFile(path: string): Promise<void> {
    return fsPromises.unlink(path);
}

export function fileExists(path: string): boolean {
    return fs.existsSync(path);
}
