import clipboardListener from "clipboard-event";
import { clipboard, type NativeImage } from "electron";

export interface ClipData {
    text?: string;
    html?: string;
    rtf?: string;
    image?: NativeImage;
}

let listening = false;

export function read(): ClipData {
    const data: ClipData = {};

    for (const format of clipboard.availableFormats()) {
        switch (format) {
            case "text/plain":
                data.text = clipboard.readText();
                break;
            case "text/html":
                data.html = clipboard.readHTML();
                break;
            case "text/rtf":
                data.rtf = clipboard.readRTF();
                break;
            default:
                if (format.startsWith("image/")) {
                    data.image = clipboard.readImage();
                } else {
                    // console.log(clipboard.readText());
                    // console.log(clipboard.readHTML());
                    // console.log(clipboard.readRTF());
                    // console.log(clipboard.readBuffer(format));
                    // console.log(clipboard.read(format));
                    console.warn(`Unsupported clipboard format: ${format}`);
                }
        }
    }

    return data;
}

export function onChange(callback: (data: ClipData) => void) {
    if (!listening) {
        listening = true;
        clipboardListener.startListening();
    }

    clipboardListener.on("change", () => {
        callback(read());
    });
}
