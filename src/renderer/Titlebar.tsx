import { CaretDownFill, PinAngleFill, Search, XCircleFill, XLg } from "react-bootstrap-icons";
import type { List } from "../types/types";
import { isMacOS } from "../util/isMacOS";
import { apiRenderer } from "../api";

interface Props {
    activeList: List;
    itemsCount: number;
    totalCount: number;
    pinned: boolean;
    showSearch: boolean;
    showSettings: boolean;
}

const isMac = isMacOS();

export function Titlebar({
    activeList,
    itemsCount,
    totalCount,
    pinned,
    showSearch,
    showSettings,
}: Props): JSX.Element {
    function renderPinned() {
        return (
            <button
                className={"icon-btn" + (pinned ? " active" : "")}
                onClick={() => apiRenderer.command({ id: "togglePinned" })}
            >
                <PinAngleFill />
            </button>
        );
    }

    function renderSearch() {
        if (showSettings) {
            return null;
        }
        return (
            <button
                className={"icon-btn" + (showSearch ? " active" : "")}
                onClick={() => apiRenderer.command({ id: "toggleSearch" })}
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
                onClick={() => apiRenderer.command({ id: "toggleShowHide" })}
            >
                {isMac ? <XCircleFill /> : <XLg />}
            </button>
        );
    }

    function renderTitle() {
        const className = "title " + (isMac ? "padding-left" : "padding-right");

        if (showSettings) {
            return <div className={className}>Settings</div>;
        }

        const count = (() => {
            if (itemsCount === totalCount) {
                return `${itemsCount}`;
            }
            return `${itemsCount} / ${totalCount}`;
        })();

        return (
            <div className={className}>
                <button className="icon-btn" onClick={() => apiRenderer.menu({ type: "lists" })}>
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
