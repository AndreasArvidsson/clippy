import * as fs from "fs";
import chokidar from "chokidar";
import { join } from "node:path";
import { getCommunicationDirPath } from "./getCommunicationDirPath";
import { initializeCommunicationDir } from "./initializeCommunicationDir";
import { readRequest, writeResponse } from "./io";

export default class RpcServer {
    private dirPath: string;
    private requestPath: string;
    private responsePath: string;
    private callback?: (data: unknown) => Promise<unknown>;
    private executing: boolean = false;

    constructor(private name: string) {
        this.dirPath = getCommunicationDirPath(name);
        this.requestPath = join(this.dirPath, "request.json");
        this.responsePath = join(this.dirPath, "response.json");
    }

    init(callback: (data: unknown) => Promise<unknown>) {
        this.callback = callback;

        initializeCommunicationDir(this.dirPath);

        chokidar
            .watch(this.requestPath)
            .on("add", (path) => {
                console.log(`File ${path} has been added`, Date.now());

                void this.executeRequest();
            })
            .on("change", (path) => {
                console.log(`File ${path} has been changed`, Date.now());

                void this.executeRequest();
            });
    }

    private async executeRequest(): Promise<void> {
        if (this.executing) {
            console.log("Already executing!!!!!");
            return;
        }

        this.executing = true;

        try {
            const { uuid, data, returnCommandOutput, waitForFinish } = await readRequest(
                this.requestPath,
            );

            try {
                const callbackPromise = this.callback!(data);

                let returnValue: unknown = null;

                if (returnCommandOutput) {
                    returnValue = await callbackPromise;
                } else if (waitForFinish) {
                    await callbackPromise;
                }

                await writeResponse(this.responsePath, {
                    uuid,
                    returnValue,
                    error: null,
                    warnings: [],
                });
            } catch (error) {
                await writeResponse(this.responsePath, {
                    uuid,
                    error: (error as Error).message,
                    warnings: [],
                });
            }
        } catch (error) {
            console.error(error);
        }

        this.executing = false;
    }
}
