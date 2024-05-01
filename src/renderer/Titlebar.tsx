import { CaretDownFill, PinAngleFill, Search, XCircleFill, XLg } from "react-bootstrap-icons";
import { NAME } from "../constants";
import { isMacOS } from "../util/isMacOS";
import api from "./api";

interface Props {
    itemsCount: number;
    totalCount: number;
    pinned: boolean;
    showSearch: boolean;
}

const isMac = isMacOS();

export function Titlebar({ itemsCount, totalCount, pinned, showSearch }: Props): JSX.Element {
    function renderPinned() {
        return (
            <button
                className={pinned ? "active" : undefined}
                onClick={() => api.command({ id: "togglePinned" })}
            >
                <PinAngleFill />
            </button>
        );
    }

    function renderSearch() {
        return (
            <button
                className={showSearch ? "active" : undefined}
                onClick={() => api.command({ id: "toggleSearch" })}
            >
                <Search />
            </button>
        );
    }

    function renderClose() {
        return (
            <button id="close-btn" onClick={() => api.command({ id: "showHide" })}>
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
        const className = isMac ? "padding-left" : "padding-right";
        return (
            <div className={"title " + className}>
                <button onClick={() => api.menu({ type: "lists" })}>
                    {NAME} ({count}) <CaretDownFill />
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
