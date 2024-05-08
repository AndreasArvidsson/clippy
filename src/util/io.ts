import * as fsPromises from "node:fs/promises";

export async function readJsonFile<T>(path: string): Promise<T> {
    const data = await fsPromises.readFile(path, "utf-8");
    return JSON.parse(data) as T;
}

export async function writeJsonFile(path: string, data: unknown) {
    const json = JSON.stringify(data, null, 4);
    return fsPromises.writeFile(path, json, "utf-8");
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
