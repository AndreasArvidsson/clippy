import { Notification } from "electron";

export function showErrorNotification(message: string, error?: unknown) {
    console.error(message, error);
    const body = (() => {
        if (error == null) {
            return message;
        }
        const errorString = error instanceof Error ? error.message : String(error);
        return `${message}\n${errorString}`;
    })();
    new Notification({ title: "Error", body }).show();
}
