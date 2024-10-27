import { PauseFill, StarFill } from "react-bootstrap-icons";
import api from "./api";

interface Props {
    paused: boolean;
    autoStar: boolean;
}

export function Footer({ paused, autoStar }: Props): JSX.Element {
    return (
        <footer>
            <button
                className={"icon-btn" + (paused ? " active" : "")}
                onClick={() => api.command({ id: "togglePaused" })}
            >
                <PauseFill />
            </button>
            <button
                className={"icon-btn" + (autoStar ? " active" : "")}
                onClick={() => api.command({ id: "toggleAutoStar" })}
            >
                <StarFill />
            </button>

            {/* TODO: Activate settings icon when we actually have a settings menu */}
            {/* <div className="title" /> */}
            {/* <button className="icon-btn" onClick={() => console.log("TODO")}>
                <GearFill />
            </button> */}
            {/* TODO: Do we really need this? */}
            {/* <button className="icon-btn" onClick={() => api.menu({ type: "remove" })}>
                <TrashFill />
            </button>  */}
        </footer>
    );
}
