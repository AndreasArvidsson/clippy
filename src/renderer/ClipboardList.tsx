import type { JSX, TargetedMouseEvent } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import {
    getCommandForHints,
    hintsToPrimitiveTargets,
} from "../common/getCommandForHints";
import { indexToHint } from "../common/hints";
import {
    StarredList,
    UnstarredList,
    type ClipItemRender,
} from "../types/types";
import {
    ClipboardItem,
    getDataHint,
    getDataSource,
    isStarred,
} from "./ClipboardItem";
import { keyListeners } from "./keyListeners";
import { parseHintKey } from "./parseHintKey";

interface Props {
    items: ClipItemRender[];
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
        const unregisterRenameListener =
            window.api.onRenameItem(setRenameItemId);

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
        window.api.command(getCommandForHints("copyItems", hints));
        setSelected([]);
    };

    const removeSelected = () => {
        const hints = ref.current.slice();
        window.api.command(getCommandForHints("removeItems", hints));
        setSelected([]);
    };

    const renameSelected = () => {
        const hints = ref.current.slice();
        window.api.command({
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
            window.api.command(getCommandForHints("copyItems", [hint]));
        }
    };

    const onClick = (e: TargetedMouseEvent<HTMLElement>) => {
        const target = e.target as HTMLElement;
        const hint = getDataHint(target);
        const source = getDataSource(target);

        if (hint == null || source == null) {
            return;
        }

        e.stopPropagation();

        if (source === "item") {
            const superKey = e.ctrlKey || e.metaKey;
            clickItem(hint, superKey);
        } else if (source === "star") {
            window.api.command({
                id: "assignItemsToList",
                targets: hintsToPrimitiveTargets([hint]),
                name: isStarred(target) ? UnstarredList.name : StarredList.name,
            });
        }
    };

    const onContextMenu = (e: TargetedMouseEvent<HTMLElement>) => {
        const hint = getDataHint(e.target as HTMLElement);

        if (hint == null) {
            return;
        }

        e.preventDefault();
        const isSelected = _selected.includes(hint);
        if (!isSelected) {
            setSelected([]);
        }
        const hints = isSelected ? _selected.slice() : [hint];
        window.api.menu({
            type: "clipItemContext",
            hints,
        });
    };

    const stopRenaming = () => {
        setRenameItemId(undefined);
    };

    return (
        <main
            className="container-fluid clip-list"
            onClick={onClick}
            onContextMenu={onContextMenu}
        >
            {items.map((item, i) => {
                const hint = indexToHint(i);
                return (
                    <ClipboardItem
                        key={item.id}
                        item={item}
                        hint={hint}
                        isSelected={_selected.includes(hint)}
                        isRenaming={item.id === renameItemId}
                        stopRenaming={stopRenaming}
                    />
                );
            })}
        </main>
    );
}
