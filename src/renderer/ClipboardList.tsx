import React, { useEffect, useRef, useState } from "react";
import { Trash } from "react-bootstrap-icons";
import type { ClipItem } from "../types/types";
import { getCommandForHints } from "../util/getCommandForHints";
import { indexToHint } from "../util/hints";
import api from "./api";
import { isNormal } from "./keybinds";

interface Props {
    items: ClipItem[];
}

export function ClipboardList({ items }: Props): JSX.Element {
    const ref = useRef<string[]>([]);
    const [selected, setSelected] = useState<string[]>(ref.current);

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (isNormal(e) && e.key === "Enter") {
                const hints = [...ref.current];
                hints.sort();
                api.command(getCommandForHints("copyItems", hints));
            }
        }

        window.addEventListener("keydown", onKeyDown);

        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
        <main className="container-fluid clip-list">
            {items.map((item, i) => {
                const hint = indexToHint(i);
                const isSelected = selected.includes(hint);

                return (
                    <React.Fragment key={item.id}>
                        {i > 0 && <hr />}
                        <div
                            className={"row clip-item" + (isSelected ? " selected" : "")}
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
                                    api.command(getCommandForHints("copyItems", [hint]));
                                }
                            }}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                api.menu({ type: "clipItemContext", hint });
                            }}
                        >
                            <div className="col-auto clip-number">{hint}</div>
                            <div className="col clip-content">{renderClipItem(item)}</div>
                            <div className="col-auto clip-trash">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        api.command(getCommandForHints("removeItems", [hint]));
                                    }}
                                >
                                    <Trash />
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
        return <img src={item.image} alt={item.meta?.alt} title={item.meta?.alt} />;
    }
    const text = item.text ?? item.rtf;
    if (text != null) {
        return <span title={text}>{text}</span>;
    }
    return <span>[FAILED TO RENDER]</span>;
}
