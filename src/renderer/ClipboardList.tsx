import { Trash } from "react-bootstrap-icons";
import type { ClipItem } from "../types/ClipboardItem";
import api from "./api";
import React from "react";

interface Props {
    items: ClipItem[];
}

export function ClipboardList({ items }: Props): JSX.Element {
    return (
        <div className="container-fluid clip-list">
            {items.map((item, i) => (
                <React.Fragment key={item.id}>
                    {i > 0 && <hr />}
                    <div className="row clip-item" onClick={() => api.clipItemClick(item)}>
                        <div className="col-auto clip-number">{i + 1}</div>
                        <div className="col clip-content">
                            <hr />
                            {renderData(item)}
                        </div>
                        <div className="col-auto clip-trash">
                            <button
                                onClick={(e) => {
                                    api.clipItemRemove(item);
                                    e.stopPropagation();
                                }}
                            >
                                <Trash />
                            </button>
                        </div>
                    </div>
                </React.Fragment>
            ))}
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
