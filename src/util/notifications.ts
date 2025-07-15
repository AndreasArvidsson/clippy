import { Notification } from "electron";

export function showErrorNotification(message: string, error?: unknown) {
    let body: string;

    if (error != null) {
        console.error(message, error);
        body = error instanceof Error ? `${message}\n${error.message}` : message;
    } else {
        console.error(message);
        body = message;
    }

    new Notification({ title: "Error", body }).show();
}
