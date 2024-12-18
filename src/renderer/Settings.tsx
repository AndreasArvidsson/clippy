import type { Config } from "../types/types";

interface Props {
    config: Config;
}

export function Settings({ config }: Props): JSX.Element {
    return <main className="container-fluid">{JSON.stringify(config, null, 2)}</main>;
}
