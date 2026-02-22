import type { JSX } from "preact";
import { GearFill, PauseFill, StarFill } from "react-bootstrap-icons";
import classNames from "./classNames";
import { getText } from "./texts";

interface Props {
    paused: boolean;
    autoStar: boolean;
    showSettings: boolean;
}

export function Footer({ paused, autoStar, showSettings }: Props): JSX.Element {
    return (
        <footer>
            <button
                title={getText("paused")}
                className={classNames("icon-btn", paused && "active")}
                onClick={() => window.api.command({ id: "togglePaused" })}
            >
                <PauseFill />
            </button>

            <button
                title={getText("autoStar")}
                className={classNames("icon-btn", autoStar && "active")}
                onClick={() => window.api.command({ id: "toggleAutoStar" })}
            >
                <StarFill />
            </button>

            <div className="title" />

            <button
                title={getText("showSettings")}
                className={classNames("icon-btn", showSettings && "active")}
                onClick={() => window.api.command({ id: "toggleSettings" })}
            >
                <GearFill />
            </button>
        </footer>
    );
}
