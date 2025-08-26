import { createRoot } from "react-dom/client";
import { Root } from "./Root";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

const domNode = document.getElementById("root")!;
const root = createRoot(domNode);
root.render(<Root />);
