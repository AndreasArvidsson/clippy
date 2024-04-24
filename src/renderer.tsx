import { clipboard } from "electron";
import clipboardListener from "clipboard-event";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import Index from "./Index";

clipboardListener.startListening();

clipboardListener.on("change", () => {
    console.log("Clipboard changed");
    console.log(clipboard.readText());
});

const domNode = document.getElementById("root")!;
const root = createRoot(domNode);
root.render(<Index />);
