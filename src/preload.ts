import { contextBridge, ipcRenderer } from "electron";
import { isMacOS } from "./util/isMacOS";

// Expose a minimal, explicit surface to the renderer
contextBridge.exposeInMainWorld("api", {
    invoke: (channel: string, ...args: unknown[]) => ipcRenderer.invoke(channel, ...args),

    send: (channel: string, ...args: unknown[]) => ipcRenderer.send(channel, ...args),

    on: (channel: string, listener: (...args: unknown[]) => void) => {
        const subscription = (_: Electron.IpcRendererEvent, ...args: unknown[]) =>
            listener(...args);
        ipcRenderer.on(channel, subscription);
        return () => ipcRenderer.off(channel, subscription);
    },

    off: (channel: string, listener: (...args: unknown[]) => void) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        ipcRenderer.off(channel, listener as any),
});

contextBridge.exposeInMainWorld("platform", {
    isMacOS: isMacOS,
});
