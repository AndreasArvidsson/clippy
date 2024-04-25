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

    constructor(private name: string) {
        this.dirPath = getCommunicationDirPath(name);
        this.requestPath = join(this.dirPath, "request.json");
        this.responsePath = join(this.dirPath, "response.json");
    }

    init(callback: (data: unknown) => Promise<unknown>) {
        this.callback = callback;

        initializeCommunicationDir(this.dirPath);

        chokidar.watch(this.requestPath).on("add", async (path) => {
            console.log(`File ${path} has been added`);

            try {
                this.executeRequest();
            } catch (error) {
                console.error(error);
            }
        });
    }

    private async executeRequest() {
        const request = await readRequest(this.requestPath);

        const { uuid, data, returnCommandOutput, waitForFinish } = request;

        try {
            const callbackPromise = this.callback!(data);

            let returnValue: unknown = null;

            if (returnCommandOutput) {
                returnValue = await callbackPromise;
            } else if (waitForFinish) {
                await callbackPromise;
            }

            await writeResponse(this.responsePath, {
                uuid: request.uuid,
                returnValue,
                error: null,
                warnings: [],
            });
        } catch (error) {
            await writeResponse(this.responsePath, {
                uuid: request.uuid,
                error: (error as Error).message,
                warnings: [],
            });
        }
    }
}
