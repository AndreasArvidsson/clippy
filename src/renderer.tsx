import { createRoot } from "react-dom/client";
import { Root } from "./renderer/Root";

const domNode = document.getElementById("root")!;
const root = createRoot(domNode);
root.render(<Root />);

function handleKeyPress(event: KeyboardEvent) {
    console.log(`You pressed ${event.key}`);
}

window.addEventListener("keydown", handleKeyPress, true);
