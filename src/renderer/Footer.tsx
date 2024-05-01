import { GearFill, PauseFill, StarFill, TrashFill } from "react-bootstrap-icons";
import api from "./api";

interface Props {
    paused: boolean;
}

export function Footer({ paused }: Props): JSX.Element {
    return (
        <footer>
            <button className="icon-btn" onClick={() => console.log("TODO")}>
                <GearFill />
            </button>
            <button
                className={"icon-btn" + (paused ? " active" : "")}
                onClick={() => api.command({ id: "togglePaused" })}
            >
                <PauseFill />
            </button>
            <button className="icon-btn" onClick={() => console.log("TODO")}>
                <StarFill />
            </button>
            <div className="title" />
            <button className="icon-btn" onClick={() => api.menu({ type: "remove" })}>
                <TrashFill />
            </button>
        </footer>
    );
}
