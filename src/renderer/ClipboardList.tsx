import React, { useEffect, useRef, useState } from "react";
import { StarFill } from "react-bootstrap-icons";
import { apiRenderer } from "../api";
import { StarredList, type ClipItem } from "../types/types";
import { getCommandForHints, hintsToPrimitiveTargets } from "../util/getCommandForHints";
import { indexToHint } from "../util/hints";
import classNames from "./classNames";
import InputText from "./InputText";
import { isNormal } from "./keybinds";

interface Props {
    items: ClipItem[];
}

export function ClipboardList({ items }: Props): JSX.Element {
    const ref = useRef<string[]>([]);
    const [selected, setSelected] = useState<string[]>(ref.current);
    const [renameItemId, setRenameItemId] = useState<string>();

    useEffect(() => {
        apiRenderer.onRenameItem(setRenameItemId);

        function onKeyDown(e: KeyboardEvent) {
            if (isNormal(e) && e.key === "Enter") {
                const hints = [...ref.current];
                hints.sort();
                apiRenderer.command(getCommandForHints("copyItems", hints));
            }
        }

        window.addEventListener("keydown", onKeyDown);

        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    function renderRenameName(item: ClipItem, hint: string) {
        return (
            <div className="clip-name">
                <InputText
                    type="search"
                    className="form-control-sm"
                    autoFocus
                    placeholder="Item name"
                    value={item.name}
                    onBlur={() => setRenameItemId(undefined)}
                    onChange={(value) => {
                        setRenameItemId(undefined);
                        apiRenderer.command({
                            id: "renameItems",
                            targets: hintsToPrimitiveTargets([hint]),
                            name: value,
                        });
                    }}
                />
            </div>
        );
    }

    const renderName = (item: ClipItem, hint: string) => {
        if (item.id === renameItemId) {
            return renderRenameName(item, hint);
        }
        if (item.name == null) {
            return undefined;
        }
        return <div className="clip-name">{item.name}</div>;
    };

    return (
        <main className="container-fluid clip-list">
            {items.map((item, i) => {
                const hint = indexToHint(i);
                const isSelected = selected.includes(hint);

                return (
                    <React.Fragment key={item.id}>
                        {i > 0 && <hr />}
                        <div
                            className={classNames("row clip-item", { selected: isSelected })}
                            onClick={(e) => {
                                if (e.ctrlKey) {
                                    if (isSelected) {
                                        selected.splice(selected.indexOf(hint), 1);
                                    } else {
                                        selected.push(hint);
                                    }
                                    ref.current = [...selected];
                                    setSelected(ref.current);
                                } else {
                                    apiRenderer.command(getCommandForHints("copyItems", [hint]));
                                }
                            }}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                apiRenderer.menu({ type: "clipItemContext", hint });
                            }}
                        >
                            <div className="col-auto clip-number">{hint}</div>
                            <div className="col clip-content">
                                {renderName(item, hint)}
                                {renderClipItem(item)}
                            </div>
                            <div className="col-auto">
                                <button
                                    className={classNames("icon-btn star-btn", {
                                        active: item.list != null,
                                    })}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        apiRenderer.command({
                                            id: "assignItemsToList",
                                            targets: hintsToPrimitiveTargets([hint]),
                                            name: item.list != null ? undefined : StarredList.name,
                                        });
                                    }}
                                >
                                    <StarFill />
                                </button>
                            </div>
                        </div>
                    </React.Fragment>
                );
            })}
        </main>
    );
}

function renderClipItem(item: ClipItem): JSX.Element {
    if (item.image != null) {
        return (
            <div className="clip-content-image" title={item.meta?.alt}>
                <img src={item.image} alt={item.meta?.alt} />
            </div>
        );
    }
    const text = item.text ?? item.rtf;
    if (text != null) {
        if (text.includes("\n")) {
            return (
                <pre className="clip-content-text" title={text}>
                    {text}
                </pre>
            );
        }
        return (
            <div className="clip-content-text" title={text}>
                {text}
            </div>
        );
    }
    return <div>[FAILED TO RENDER]</div>;
}
