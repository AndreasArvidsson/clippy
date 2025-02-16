import React, { useEffect, useRef, useState } from "react";
import { StarFill } from "react-bootstrap-icons";
import { apiRenderer } from "../api";
import { StarredList, UnstarredList, type ClipItem } from "../types/types";
import { getCommandForHints, hintsToPrimitiveTargets } from "../util/getCommandForHints";
import { indexToHint } from "../util/hints";
import classNames from "./classNames";
import InputText from "./InputText";
import { keyListeners } from "./keyListeners";
import { parseHintKey } from "./parseHintKey";

interface Props {
    items: ClipItem[];
}

export function ClipboardList({ items }: Props): JSX.Element {
    const ref = useRef<string[]>([]);
    const [_selected, _setSelected] = useState<string[]>(ref.current);
    const [renameItemId, setRenameItemId] = useState<string>();

    const setSelected = (selected: string[]) => {
        ref.current = selected;
        _setSelected(ref.current);
    };

    useEffect(() => {
        setSelected([]);
    }, [items]);

    useEffect(() => {
        const unregisterRenameListener = apiRenderer.onRenameItem(setRenameItemId);

        const listener = (key: string): boolean => {
            switch (key) {
                case "Enter": {
                    copySelected();
                    break;
                }
                case "Delete":
                    removeSelected();
                    break;
                case "F2":
                    renameSelected();
                    break;
                case "Escape": {
                    setSelected([]);
                    break;
                }
                default: {
                    const hint = parseHintKey(key);
                    if (hint != null) {
                        clickItem(hint.hint, hint.superKey);
                        return true;
                    }
                    return false;
                }
            }
            return true;
        };

        keyListeners.register(listener);

        return () => {
            unregisterRenameListener();
            keyListeners.unregister(listener);
        };
    }, []);

    const copySelected = () => {
        const hints = ref.current.slice();
        hints.sort();
        apiRenderer.command(getCommandForHints("copyItems", hints));
        setSelected([]);
    };

    const removeSelected = () => {
        const hints = ref.current.slice();
        apiRenderer.command(getCommandForHints("removeItems", hints));
        setSelected([]);
    };

    const renameSelected = () => {
        const hints = ref.current.slice();
        apiRenderer.command({
            id: "renameItems",
            targets: hintsToPrimitiveTargets(hints),
        });
        setSelected([]);
    };

    const clickItem = (hint: string, superKey: boolean) => {
        const selected = ref.current;
        // ctrl + hint key: Toggle item selection
        // If we already have selection we always toggle selection
        if (superKey || selected.length > 0) {
            const isSelected = selected.includes(hint);
            if (isSelected) {
                selected.splice(selected.indexOf(hint), 1);
            } else {
                selected.push(hint);
            }
            setSelected([...selected]);
        }
        // hint key: Copy item
        else {
            apiRenderer.command(getCommandForHints("copyItems", [hint]));
        }
    };

    const renderRenameName = (item: ClipItem, hint: string): JSX.Element => {
        return (
            <div className="clip-name">
                <InputText
                    type="search"
                    className="form-control-sm"
                    autoFocus
                    placeholder="Item name"
                    value={item.name}
                    onBlur={() => setRenameItemId(undefined)}
                    onEscape={() => setRenameItemId(undefined)}
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
    };

    const renderName = (item: ClipItem, hint: string): JSX.Element | undefined => {
        if (item.id === renameItemId) {
            return renderRenameName(item, hint);
        }
        if (item.name == null) {
            return undefined;
        }
        return <div className="clip-name">{item.name}</div>;
    };

    const renderItem = (item: ClipItem, hint: string): JSX.Element => {
        const isSelected = _selected.includes(hint);

        return (
            <div
                className={classNames("row clip-item", { selected: isSelected })}
                onClick={(e) => clickItem(hint, e.ctrlKey || e.metaKey)}
                onContextMenu={(e) => {
                    e.preventDefault();
                    if (!isSelected) {
                        setSelected([]);
                    }
                    const hints = isSelected ? _selected.slice() : [hint];
                    apiRenderer.menu({
                        type: "clipItemContext",
                        hints,
                    });
                }}
            >
                <div className="col-auto clip-hint">{hint}</div>

                <div className="col clip-content">
                    {renderName(item, hint)}
                    {renderItemContent(item)}
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
                                name: item.list != null ? UnstarredList.id : StarredList.id,
                            });
                        }}
                    >
                        <StarFill />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <main className="container-fluid clip-list">
            {items.map((item, i) => {
                const hint = indexToHint(i);
                return (
                    <React.Fragment key={item.id}>
                        {i > 0 && <hr />}
                        {renderItem(item, hint)}
                    </React.Fragment>
                );
            })}
        </main>
    );
}

function renderItemContent(item: ClipItem): JSX.Element {
    if (item.image != null) {
        return (
            <div className="clip-content-image" title={item.image.alt}>
                <img src={item.image.data} alt={item.image.alt} />
            </div>
        );
    }

    const text = item.text ?? item.rtf ?? item.html ?? "";

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
