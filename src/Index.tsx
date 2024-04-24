import { useEffect, useState } from "react";
import * as clipboard from "./clipboard";
import type { ClipData } from "./clipboard";
import classnames from "classnames";

export default function Index() {
    const [clipDatas, setClipDatas] = useState<ClipData[]>([]);

    useEffect(() => {
        setClipDatas([clipboard.read()]);

        clipboard.onChange((data) => {
            clipDatas.push(data);
            setClipDatas([...clipDatas]);
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
    if (data.image != null) {
        return <img src={data.image.toDataURL()} className="clip-image" />;
    }
    if (data.text != null) {
        return data.text;
    }
    return undefined;
}
