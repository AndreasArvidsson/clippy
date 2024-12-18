import { GearFill, PauseFill, StarFill } from "react-bootstrap-icons";
import { apiRenderer } from "../api";
import classNames from "./classNames";

interface Props {
    paused: boolean;
    autoStar: boolean;
    showSettings: boolean;
}

export function Footer({ paused, autoStar, showSettings }: Props): JSX.Element {
    return (
        <footer>
            <button
                className={classNames("icon-btn", { active: paused })}
                onClick={() => apiRenderer.command({ id: "togglePaused" })}
            >
                <PauseFill />
            </button>

            <button
                className={classNames("icon-btn", { active: autoStar })}
                onClick={() => apiRenderer.command({ id: "toggleAutoStar" })}
            >
                <StarFill />
            </button>

            <div className="title" />

            <button
                className={classNames("icon-btn", { active: showSettings })}
                onClick={() => apiRenderer.command({ id: "toggleSettings" })}
            >
                <GearFill />
            </button>
        </footer>
    );
}
