import { globalShortcut } from "electron";
import { join } from "node:path";
import { showErrorNotification } from "../util/notifications";
import { getCommunicationDirPath } from "./getCommunicationDirPath";
import { initializeCommunicationDir } from "./initializeCommunicationDir";
import { readRequest, writeResponse } from "./io";

export default class RpcServer<T> {
    private dirPath: string;
    private requestPath: string;
    private responsePath: string;
    private callback?: (data: T) => unknown;
    private executing: boolean = false;

    constructor(
        private name: string,
        private keybind: Electron.Accelerator,
    ) {
        this.dirPath = getCommunicationDirPath(name);
        this.requestPath = join(this.dirPath, "request.json");
        this.responsePath = join(this.dirPath, "response.json");
    }

    onCommand(callback: (data: T) => unknown) {
        this.callback = callback;

        initializeCommunicationDir(this.dirPath);

        const success = globalShortcut.register(this.keybind, () => {
            void this.executeRequest();
        });
        if (!success) {
            throw Error(`Failed to bind global shortcut ${this.keybind}`);
        }
    }

    private async executeRequest(): Promise<void> {
        if (this.executing) {
            showErrorNotification("Already executing!!!!!");
            return;
        }

        this.executing = true;

        try {
            const { uuid, args, returnCommandOutput, waitForFinish } = await readRequest(
                this.requestPath,
            );

            const data = args[0] as T;

            try {
                const callbackPromise = Promise.resolve(this.callback!(data));

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
            showErrorNotification("Failed to execute request", error);
        }

        this.executing = false;
    }
}
