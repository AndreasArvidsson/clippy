import { PinAngle, Search } from "react-bootstrap-icons";
import { NAME } from "../constants";
import api from "./api";

interface Props {
    itemsCount: number;
    totalCount: number;
}

export function Titlebar({ itemsCount, totalCount }: Props): JSX.Element {
    const count = (() => {
        if (itemsCount === totalCount) {
            return `${itemsCount}`;
        }
        return `${itemsCount} / ${totalCount}`;
    })();

    return (
        <header id="titlebar">
            <div id="titlebar-btns-left">
                <button onClick={() => console.log("pin")}>
                    <PinAngle />
                </button>
                <button onClick={() => console.log("search")}>
                    <Search />
                </button>
            </div>

            <div id="title">
                {NAME} ({count})
            </div>

            <div id="titlebar-btns-right">
                <button onClick={() => api.windowMinimize()}>&#xE921;</button>
                <button onClick={() => api.windowMaximize()}>&#xE922;</button>
                <button id="close-btn" onClick={() => api.windowClose()}>
                    &#xE8BB;
                </button>
            </div>
        </header>
    );
}
