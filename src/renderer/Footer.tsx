import { GearFill, PauseFill, StarFill, TrashFill } from "react-bootstrap-icons";
import api from "./api";

export function Footer(): JSX.Element {
    return (
        <footer>
            <div className="buttons">
                <button onClick={() => console.log("TODO")}>
                    <GearFill />
                </button>
                <button onClick={() => console.log("TODO")}>
                    <PauseFill />
                </button>
                <button onClick={() => console.log("TODO")}>
                    <StarFill />
                </button>
            </div>
            <div className="title"></div>
            <div className="buttons">
                <button onClick={() => api.menu({ type: "remove" })}>
                    <TrashFill />
                </button>
            </div>
        </footer>
    );
}
