import React, { useEffect, useRef, useState } from "react";
import { Trash } from "react-bootstrap-icons";
import { type ClipItem } from "../types/ClipboardItem";
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
        <div className="container-fluid clip-list">
            {items.map((item, i) => {
                const hint = indexToHint(i);
                const isSelected = selected.includes(hint);

                return (
                    <React.Fragment key={hint}>
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
                        >
                            <div className="col-auto clip-number">{hint}</div>
                            <div className="col clip-content">
                                <hr />
                                {renderData(item)}
                            </div>
                            <div className="col-auto clip-trash">
                                <button
                                    onClick={(e) => {
                                        api.command(getCommandForHints("removeItems", [hint]));
                                        e.stopPropagation();
                                    }}
                                >
                                    <Trash />
                                </button>
                            </div>
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
}

function renderData(data: ClipItem): JSX.Element {
    switch (data.type) {
        case "image":
            return <img src={data.dataUrl} />;
        case "text":
            if (data.text.includes("\n")) {
                return <pre title={data.text}>{data.text}</pre>;
            }
            return <span title={data.text}>{data.text}</span>;
    }
}
