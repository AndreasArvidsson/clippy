import { CaretDownFill, PinAngleFill, Search, XCircleFill, XLg } from "react-bootstrap-icons";
import type { List } from "../types/types";
import { isMacOS } from "../util/isMacOS";
import api from "./api";

interface Props {
    activeList: List;
    itemsCount: number;
    totalCount: number;
    pinned: boolean;
    showSearch: boolean;
}

const isMac = isMacOS();

export function Titlebar({
    activeList,
    itemsCount,
    totalCount,
    pinned,
    showSearch,
}: Props): JSX.Element {
    function renderPinned() {
        return (
            <button
                className={"icon-btn" + (pinned ? " active" : "")}
                onClick={() => api.command({ id: "togglePinned" })}
            >
                <PinAngleFill />
            </button>
        );
    }

    function renderSearch() {
        return (
            <button
                className={"icon-btn" + (showSearch ? " active" : "")}
                onClick={() => api.command({ id: "toggleSearch" })}
            >
                <Search />
            </button>
        );
    }

    function renderClose() {
        return (
            <button
                className="icon-btn"
                id="close-btn"
                onClick={() => api.command({ id: "toggleShowHide" })}
            >
                {isMac ? <XCircleFill /> : <XLg />}
            </button>
        );
    }

    function renderTitle() {
        const count = (() => {
            if (itemsCount === totalCount) {
                return `${itemsCount}`;
            }
            return `${itemsCount} / ${totalCount}`;
        })();
        return (
            <div className={"title " + (isMac ? "padding-left" : "padding-right")}>
                <button className="icon-btn" onClick={() => api.menu({ type: "lists" })}>
                    {activeList.name} ({count}) <CaretDownFill />
                </button>
            </div>
        );
    }

    if (isMac) {
        return (
            <header>
                {renderClose()}
                {renderTitle()}
                {renderSearch()}
                {renderPinned()}
            </header>
        );
    }

    return (
        <header>
            {renderPinned()}
            {renderSearch()}
            {renderTitle()}
            {renderClose()}
        </header>
    );
}
