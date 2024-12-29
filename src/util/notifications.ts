import { Notification } from "electron";

export function showErrorNotification(message: string, error?: unknown) {
    let body: string;

    if (error != null) {
        console.error(message, error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        body = `${message}\n${errorMessage}`;
    } else {
        console.error(message);
        body = message;
    }

    new Notification({ title: "Error", body }).show();
}
