import { PinAngle, PinAngleFill, Search } from "react-bootstrap-icons";
import { NAME } from "../constants";
import api from "./api";

interface Props {
    itemsCount: number;
    totalCount: number;
    pinned: boolean;
}

export function Titlebar({ itemsCount, totalCount, pinned }: Props): JSX.Element {
    const count = (() => {
        if (itemsCount === totalCount) {
            return `${itemsCount}`;
        }
        return `${itemsCount} / ${totalCount}`;
    })();

    return (
        <header id="titlebar">
            <div id="titlebar-btns-left">
                <button onClick={() => api.command({ id: "togglePinned" })}>
                    {pinned ? <PinAngleFill /> : <PinAngle />}
                </button>
                <button onClick={() => api.command({ id: "toggleSearch" })}>
                    <Search />
                </button>
            </div>

            <div id="title">
                {NAME} ({count})
            </div>

            <div id="titlebar-btns-right">
                <button id="close-btn" onClick={() => api.command({ id: "showHide" })}>
                    &#xE8BB;
                </button>
            </div>
        </header>
    );
}
