import { useEffect, useState } from "react";
import type { ClipData, InitialData } from "../types/types";
import { ClipboardList } from "./ClipboardList";
import { Search } from "./Search";
import { Titlebar } from "./Titlebar";
import api from "./api";

export function Root(): JSX.Element | null {
    const [clipData, setClipData] = useState<ClipData>();
    const [initData, setInitData] = useState<InitialData>();

    useEffect(() => {
        api.getInitialData()
            .then((data) => {
                setInitData(data);
                setClipData(data.clipData);
            })
            .catch(console.error);
        api.onClipboardUpdate(setClipData);
    }, []);

    if (clipData == null || initData == null) {
        return null;
    }

    return (
        <>
            <Titlebar itemsCount={clipData.items.length} totalCount={clipData.totalCount} />

            <main>
                <Search init={initData.search} />

                <ClipboardList items={clipData.items} />
            </main>
        </>
    );
}
