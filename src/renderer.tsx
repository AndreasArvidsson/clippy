import { createRoot } from "react-dom/client";
import Index from "./Index";

const domNode = document.getElementById("root")!;
const root = createRoot(domNode);
root.render(<Index />);
