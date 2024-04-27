import classnames from "classnames";
import type { ClipItem } from "../types/ClipboardItem";
import api from "./api";

interface Props {
    items: ClipItem[];
}

export function ClipboardList({ items }: Props): JSX.Element {
    return (
        <div className="overflow-x-hidden">
            <table>
                <tbody>
                    {items.map((item, i) => (
                        <tr
                            key={item.id}
                            className={classnames("clip-item", {
                                "border-top": i > 0,
                            })}
                            onClick={() => api.clipItemClick(item)}
                        >
                            <th className="clip-number">{i + 1}</th>
                            <td className="clip-content">{renderData(item)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function renderData(data: ClipItem): JSX.Element {
    switch (data.type) {
        case "image":
            return <img src={data.dataUrl} />;
        case "text":
            return <pre title={data.text}>{data.text}</pre>;
    }
}
