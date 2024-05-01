import { useEffect, useState } from "react";
import type { RendererData } from "../types/types";
import { ClipboardList } from "./ClipboardList";
import { Footer } from "./Footer";
import { Search } from "./Search";
import { Titlebar } from "./Titlebar";
import api from "./api";
import "./keybinds";

export function Root(): JSX.Element | null {
    const [data, setData] = useState<RendererData>();

    useEffect(() => {
        api.getInitialData()
            .then((data) => {
                setData(data);
                api.onUpdate(setData);
            })
            .catch(console.error);
    }, []);

    if (data == null) {
        return null;
    }

    return (
        <>
            <Titlebar
                itemsCount={data.items.length}
                totalCount={data.totalCount}
                pinned={data.config.pinned}
                showSearch={data.config.showSearch}
            />

            {data.config.showSearch && <Search value={data.search} />}

            <ClipboardList items={data.items} />

            <Footer paused={data.config.paused} />
        </>
    );
}
