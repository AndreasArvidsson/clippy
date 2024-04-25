import classnames from "classnames";
import { useEffect, useRef, useState } from "react";
import type { ClipData } from "./clipboard";
import * as clipboard from "./clipboard";
import RpcServer from "./rpc/RpcServer";
import { ID } from "./constants";

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

        const rpc = new RpcServer(ID);

        rpc.init((data) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
            return (data as any).value + 1;
        });
    }, []);

    return (
        <div className="overflow-x-hidden">
            <table>
                <tbody>
                    {clipDatas.map((data, i) => (
                        <tr
                            key={i}
                            className={classnames("clip-item", {
                                "border-top": i > 0,
                            })}
                            onClick={() => clipboard.write(data)}
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
            return <img src={data.dataUrl} />;
        case "text":
            return <pre title={data.text}>{data.text}</pre>;
    }
}
