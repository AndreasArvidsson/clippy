import { PinAngleFill, Search, XCircleFill, XLg } from "react-bootstrap-icons";
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
    const count = (() => {
        if (itemsCount === totalCount) {
            return `${itemsCount}`;
        }
        return `${itemsCount} / ${totalCount}`;
    })();

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
        return (
            <div className="title">
                {NAME} ({count})
            </div>
        );
    }

    if (isMac) {
        return (
            <header>
                <div className="buttons">{renderClose()}</div>

                {renderTitle()}

                <div className="buttons">
                    {renderSearch()}
                    {renderPinned()}
                </div>
            </header>
        );
    }

    return (
        <header>
            <div className="buttons">
                {renderPinned()}
                {renderSearch()}
            </div>

            {renderTitle()}

            <div className="buttons">{renderClose()}</div>
        </header>
    );
}
