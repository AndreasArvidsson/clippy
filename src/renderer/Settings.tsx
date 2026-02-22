import type { JSX } from "preact";
import type { Config } from "../types/types";
import InputCheckbox from "./InputCheckbox";
import InputNumber from "./InputNumber";
import { texts } from "./texts";
import { useEffect, useState } from "preact/hooks";

interface Props {
    config: Config;
}

function patchConfig(config: Partial<Config>) {
    window.api.command({ id: "patchConfig", config });
}

export function Settings({ config }: Props): JSX.Element {
    const [version, setVersion] = useState<string>();

    useEffect(() => {
        window.api.getAppVersion().then(setVersion).catch(console.error);
    }, []);

    return (
        <main className="container-fluid">
            <InputCheckbox
                title={texts.startWithOS.desc}
                checked={config.startWithOS}
                onChange={(startWithOS) => patchConfig({ startWithOS })}
            >
                {texts.startWithOS.title}
            </InputCheckbox>

            <InputCheckbox
                title={texts.alwaysOnTop.desc}
                checked={config.alwaysOnTop}
                onChange={(alwaysOnTop) => patchConfig({ alwaysOnTop })}
            >
                {texts.alwaysOnTop.title}
            </InputCheckbox>

            <InputCheckbox
                title={texts.pinned.desc}
                checked={config.pinned}
                onChange={(pinned) => patchConfig({ pinned })}
            >
                {texts.pinned.title}
            </InputCheckbox>

            <InputCheckbox
                title={texts.paused.desc}
                checked={config.paused}
                onChange={(paused) => patchConfig({ paused })}
            >
                {texts.paused.title}
            </InputCheckbox>

            <InputCheckbox
                title={texts.autoStar.desc}
                checked={config.autoStar}
                onChange={(autoStar) => patchConfig({ autoStar })}
            >
                {texts.autoStar.title}
            </InputCheckbox>

            <div className="mt-2" style={{ width: "10rem" }}>
                <InputNumber
                    title={texts.limit.desc}
                    isInteger
                    value={config.limit}
                    onChange={(limit) => patchConfig({ limit })}
                    onBlur={(limit) => patchConfig({ limit })}
                >
                    {texts.limit.title}
                </InputNumber>
            </div>

            <div className="mt-2 ">version: {version}</div>

            <button
                className="btn btn-sm btn-primary mt-3"
                title={texts.hideSettings.desc}
                onClick={() => window.api.command({ id: "hideSettings" })}
            >
                {texts.hideSettings.title}
            </button>
        </main>
    );
}
