import { GearFill, PauseFill, StarFill } from "react-bootstrap-icons";
import { apiRenderer } from "../api";

interface Props {
    paused: boolean;
    autoStar: boolean;
    showSettings: boolean;
}

export function Footer({ paused, autoStar, showSettings }: Props): JSX.Element {
    return (
        <footer>
            <button
                className={"icon-btn" + (paused ? " active" : "")}
                onClick={() => apiRenderer.command({ id: "togglePaused" })}
            >
                <PauseFill />
            </button>
            <button
                className={"icon-btn" + (autoStar ? " active" : "")}
                onClick={() => apiRenderer.command({ id: "toggleAutoStar" })}
            >
                <StarFill />
            </button>

            <div className="title" />

            <button
                className={"icon-btn" + (showSettings ? " active" : "")}
                onClick={() => apiRenderer.command({ id: "toggleSettings" })}
            >
                <GearFill />
            </button>
        </footer>
    );
}
