import React from "react";
import { Trash } from "react-bootstrap-icons";
import { type ClipItem } from "../types/ClipboardItem";
import { indexToHint } from "../util/hints";
import api from "./api";

interface Props {
    items: ClipItem[];
}

export function ClipboardList({ items }: Props): JSX.Element {
    return (
        <div className="container-fluid clip-list">
            {items.map((item, i) => {
                const hint = indexToHint(i);
                return (
                    <React.Fragment key={hint}>
                        {i > 0 && <hr />}
                        <div
                            className="row clip-item"
                            onClick={() => api.command({ id: "copyItem", hint })}
                        >
                            <div className="col-auto clip-number">{hint}</div>
                            <div className="col clip-content">
                                <hr />
                                {renderData(item)}
                            </div>
                            <div className="col-auto clip-trash">
                                <button
                                    onClick={(e) => {
                                        api.command({ id: "removeItem", hint });
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
