import { apiRenderer } from "../api";
import type { Config } from "../types/types";
import InputCheckbox from "./InputCheckbox";
import InputNumber from "./InputNumber";

interface Props {
    config: Config;
}

function patchConfig(config: Partial<Config>) {
    apiRenderer.command({ id: "patchConfig", config });
}

export function Settings({ config }: Props): JSX.Element {
    return (
        <main className="container-fluid">
            <InputCheckbox
                checked={config.openAtLogin}
                onChange={(openAtLogin) => patchConfig({ openAtLogin })}
            >
                Open at login
            </InputCheckbox>

            <InputCheckbox checked={config.pinned} onChange={(pinned) => patchConfig({ pinned })}>
                Pinned
            </InputCheckbox>

            <InputCheckbox
                checked={config.showSearch}
                onChange={(showSearch) => patchConfig({ showSearch })}
            >
                Show search
            </InputCheckbox>

            <InputCheckbox checked={config.paused} onChange={(paused) => patchConfig({ paused })}>
                Paused
            </InputCheckbox>

            <InputCheckbox
                checked={config.autoStar}
                onChange={(autoStar) => patchConfig({ autoStar })}
            >
                Auto star
            </InputCheckbox>

            <InputNumber
                isInteger
                value={config.limit}
                onChange={(limit) => patchConfig({ limit })}
            >
                Limit
            </InputNumber>
        </main>
    );
}
