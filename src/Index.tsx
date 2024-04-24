import classnames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ClipData } from "./clipboard";
import * as clipboard from "./clipboard";

export default function Index(): JSX.Element {
    const [clipDatas, setClipDatas] = useState<ClipData[]>([]);
    const ref = useRef<ClipData[]>([]);

    useEffect(() => {
        const data = clipboard.read();
        ref.current = data != null ? [data] : [];
        setClipDatas(ref.current);

        clipboard.onChange((data: ClipData) => {
            const updated = ref.current.filter((d) => d.id !== data.id);
            updated.unshift(data);
            ref.current = updated;
            setClipDatas(ref.current);
        });
    }, []);

    return (
        <div className="table-container">
            <table>
                <tbody>
                    {clipDatas.map((data, i) => (
                        <tr
                            key={i}
                            className={classnames({
                                "border-top": i > 0,
                            })}
                        >
                            <th className="clip-number">{i + 1}</th>
                            <td className="clip-content">{renderData(data)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function renderData(data: ClipData): JSX.Element {
    switch (data.type) {
        case "image":
            return <img className="clip-image" src={data.dataUrl} />;
        case "text":
            return (
                <pre className="clip-text" title={data.text}>
                    {data.text}
                </pre>
            );
    }
}
