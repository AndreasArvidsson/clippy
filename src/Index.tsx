import classnames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ClipData } from "./clipboard";
import * as clipboard from "./clipboard";

export default function Index() {
    const [clipDatas, setClipDatas] = useState<ClipData[]>([]);
    const ref = useRef<ClipData[]>([]);

    useEffect(() => {
        const data = clipboard.read();
        ref.current = data != null ? [data] : [];
        setClipDatas(ref.current);

        clipboard.onChange((data: ClipData) => {
            const list = ref.current;
            const updated = list.filter((d) => d.id !== data.id);
            updated.push(data);
            ref.current = updated;
            setClipDatas(ref.current);
        });
    }, []);

    return (
        <table className="w-100">
            <tbody>
                {clipDatas.map((data, i) => (
                    <tr
                        key={i}
                        className={classnames({
                            "border-top": i > 0,
                        })}
                    >
                        <th className="clip-number">{i + 1}</th>
                        <td className="p-2">{renderData(data)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function renderData(data: ClipData) {
    switch (data.type) {
        case "image":
            return <img src={data.dataUrl} className="clip-image" />;
        case "text":
            return (
                <pre className="clip-text" title={data.text}>
                    {data.text}
                </pre>
            );
    }

    return undefined;
}
