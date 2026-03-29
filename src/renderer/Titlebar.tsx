import type { JSX } from "preact";
import {
    CaretDownFill,
    PinAngleFill,
    Search,
    XCircleFill,
    XLg,
} from "react-bootstrap-icons";
import { classNames } from "./classNames";
import { getText } from "./texts";
// oxlint-disable-next-line import/no-unassigned-import
import "./titlebar.css";

interface Props {
    activeListName: string;
    itemsCount: number;
    totalCount: number;
    pinned: boolean;
    showSearch: boolean;
    showSettings: boolean;
}

const isMac = globalThis.window.platform.isMacOS;

export function Titlebar({
    activeListName,
    itemsCount,
    totalCount,
    pinned,
    showSearch,
    showSettings,
}: Props): JSX.Element {
    function renderPinned() {
        return (
            <button
                type="button"
                title={getText("pinned")}
                className={classNames("icon-btn", pinned && "active")}
                onClick={() => {
                    globalThis.window.api.command({ id: "togglePinned" });
                }}
            >
                <PinAngleFill />
            </button>
        );
    }

    function renderSearch() {
        return (
            <button
                type="button"
                title={getText("search")}
                className={classNames("icon-btn", showSearch && "active")}
                onClick={() => {
                    globalThis.window.api.command({ id: "toggleSearch" });
                }}
            >
                <Search />
            </button>
        );
    }

    function renderClose() {
        return (
            <button
                type="button"
                title={getText("close")}
                className="icon-btn"
                id="close-btn"
                onClick={() => {
                    globalThis.window.api.command({ id: "toggleShowHide" });
                }}
            >
                {isMac ? <XCircleFill /> : <XLg />}
            </button>
        );
    }

    function renderTitle() {
        const className = classNames(
            "title",
            isMac ? "padding-left" : "padding-right",
        );

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
                <button
                    type="button"
                    className="icon-btn"
                    onClick={() => {
                        globalThis.window.api.menu({ type: "lists" });
                    }}
                >
                    {activeListName} ({count}) <CaretDownFill />
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
