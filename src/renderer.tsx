import { createRoot } from "react-dom/client";
import Index from "./Index";

const domNode = document.getElementById("root")!;
const root = createRoot(domNode);
root.render(<Index />);

function handleKeyPress(event: KeyboardEvent) {
    console.log(`You pressed ${event.key}`);
}

window.addEventListener("keydown", handleKeyPress, true);
