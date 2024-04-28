import { useEffect, useState } from "react";
import type { ClipData, Config } from "../types/types";
import { ClipboardList } from "./ClipboardList";
import { Search } from "./Search";
import { Titlebar } from "./Titlebar";
import api from "./api";

export function Root(): JSX.Element | null {
    const [clipData, setClipData] = useState<ClipData>();
    const [config, setConfig] = useState<Config>();
    const [search, setSearch] = useState<string>();

    useEffect(() => {
        api.getInitialData()
            .then((data) => {
                setClipData(data.clipData);
                setConfig(data.config);
                setSearch(data.search);

                api.onClipboardUpdate(setClipData);
                api.onConfigUpdate(setConfig);
            })
            .catch(console.error);
    }, []);

    if (clipData == null || config == null || search == null) {
        return null;
    }

    return (
        <>
            <Titlebar
                itemsCount={clipData.items.length}
                totalCount={clipData.totalCount}
                pinned={config.pinned}
            />

            <main>
                {config.showSearch && <Search init={search} />}

                <ClipboardList items={clipData.items} />
            </main>
        </>
    );
}
