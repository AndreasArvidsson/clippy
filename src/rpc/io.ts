import { FileHandle, readFile, stat, open } from "fs/promises";
import type { Request, Response } from "./types";

export const COMMAND_TIMEOUT_MS = 3000;

/**
 * Reads the JSON-encoded request from the request file, unlinking the file
 * after reading.
 * @returns A promise that resolves to a Response object
 */
export async function readRequest(requestPath: string): Promise<Request> {
    const stats = await stat(requestPath);
    const request = JSON.parse(await readFile(requestPath, "utf-8"));

    if (Math.abs(stats.mtimeMs - new Date().getTime()) > COMMAND_TIMEOUT_MS) {
        throw new Error(
            "Request file is older than timeout; refusing to execute command"
        );
    }

    return request;
}

/**
 * Writes the response to the response file as JSON.
 * Appends newline so that other side knows when it is done
 * @param responsePath The file path to write to
 * @param response The response object to JSON-encode and write to disk
 */
export async function writeResponse(responsePath: string, response: Response) {
    const file = await open(responsePath, "wx");
    await file.write(`${JSON.stringify(response)}\n`);
    await file.close();
}
