import { PinAngle, PinAngleFill, Search, XLg } from "react-bootstrap-icons";
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
        <header>
            <div className="buttons">
                <button onClick={() => api.command({ id: "togglePinned" })}>
                    {pinned ? <PinAngleFill /> : <PinAngle />}
                </button>
                <button onClick={() => api.command({ id: "toggleSearch" })}>
                    <Search />
                </button>
            </div>

            <div className="title">
                {NAME} ({count})
            </div>

            <div className="buttons">
                <button id="close-btn" onClick={() => api.command({ id: "showHide" })}>
                    <XLg />
                </button>
            </div>
        </header>
    );
}
