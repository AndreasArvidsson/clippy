import { Notification, dialog } from "electron";

export function showErrorNotification(message: string, error?: unknown) {
    const body = getErrorBody(message, error);

    new Notification({ title: "Error", body }).show();
}

export function showBlockingErrorDialog(message: string, error?: unknown) {
    const body = getErrorBody(message, error);
    dialog.showErrorBox("Error", body);
}

function getErrorBody(message: string, error?: unknown): string {
    if (error != null) {
        console.error(message, error);
        return error instanceof Error
            ? `${message}\n${error.message}`
            : message;
    }

    console.error(message);
    return message;
}
