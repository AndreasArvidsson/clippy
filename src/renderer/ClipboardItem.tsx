import type { JSX } from "preact";
import { memo } from "preact/compat";
import { StarFill } from "react-bootstrap-icons";
import { hintsToPrimitiveTargets } from "../common/getCommandForHints";
import { type ClipItemRender } from "../types/types";
import InputText from "./InputText";

interface Props {
    item: ClipItemRender;
    hint: string;
    isSelected: boolean;
    isRenaming: boolean;
    stopRenaming: () => void;
}

export function ClipboardItem({
    item,
    hint,
    isSelected,
    isRenaming,
    stopRenaming,
}: Props): JSX.Element {
    return (
        <div
            data-hint={hint}
            data-source="item"
            className={"row clip-item" + (isSelected ? " selected" : "")}
        >
            <div className="col-auto clip-hint">{hint}</div>

            <ClipboardItemMemo
                item={item}
                isRenaming={isRenaming}
                stopRenaming={stopRenaming}
            />
        </div>
    );
}

interface MemoProps {
    item: ClipItemRender;
    isRenaming: boolean;
    stopRenaming: () => void;
}

const ClipboardItemMemo = memo(function ClipboardItemMemo({
    item,
    isRenaming,
    stopRenaming,
}: MemoProps): JSX.Element {
    return (
        <>
            <div className="col clip-content">
                {renderName(item, isRenaming, stopRenaming)}
                {renderItemContent(item)}
            </div>

            <div className="col-auto">
                <button
                    data-source="star"
                    type="button"
                    className={
                        "icon-btn star-btn" + (item.starred ? " active" : "")
                    }
                >
                    <StarFill />
                </button>
            </div>
        </>
    );
}, isMemoPropsEqual);

function isMemoPropsEqual(prev: MemoProps, next: MemoProps): boolean {
    return (
        // id, name, starred are only necessary on item. Rest are immutable.
        prev.item.id === next.item.id &&
        prev.item.name === next.item.name &&
        prev.item.starred === next.item.starred &&
        prev.isRenaming === next.isRenaming
    );
}

function renderName(
    item: ClipItemRender,
    isRenaming: boolean,
    stopRenaming: () => void,
): JSX.Element | null {
    if (isRenaming) {
        return (
            <div className="clip-name">
                <InputText
                    type="search"
                    className="form-control-sm"
                    autoFocus
                    placeholder="Item name"
                    value={item.name}
                    onBlur={stopRenaming}
                    onEscape={stopRenaming}
                    onChange={(value, target) => {
                        stopRenaming();
                        const hint = getDataHint(target);

                        if (hint != null) {
                            window.api.command({
                                id: "renameItems",
                                targets: hintsToPrimitiveTargets([hint]),
                                name: value,
                            });
                        }
                    }}
                />
            </div>
        );
    }

    if (item.name == null) {
        return null;
    }

    return <div className="clip-name">{item.name}</div>;
}

function renderItemContent(item: ClipItemRender): JSX.Element {
    if (item.type === "image") {
        return (
            <div className="clip-content-image">
                <img
                    src={`clip://image/${item.id}`}
                    loading="lazy"
                    decoding="async"
                />
            </div>
        );
    }

    if (item.text?.includes("\n")) {
        return <pre className="clip-content-text">{item.text}</pre>;
    }

    return <div className="clip-content-text">{item.text}</div>;
}

export type DataSource = "item" | "star";

export function getDataHint(target: HTMLElement): string | undefined {
    const row = target.closest<HTMLElement>("div[data-hint]");
    return row?.dataset.hint;
}

export function getDataSource(target: HTMLElement): DataSource | undefined {
    const el = target.closest<HTMLElement>("[data-source]");
    return el?.dataset.source as DataSource | undefined;
}

export function isStarred(target: HTMLElement): boolean {
    const starEl = target.closest<HTMLElement>("[data-source='star']");
    return starEl != null && starEl.classList.contains("active");
}
