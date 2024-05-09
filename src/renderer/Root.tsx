import { useEffect, useState } from "react";
import type { RendererData } from "../types/types";
import { ClipboardList } from "./ClipboardList";
import { Footer } from "./Footer";
import { ListName } from "./ListName";
import type { ListNameType } from "./ListName";
import { Search } from "./Search";
import { Titlebar } from "./Titlebar";
import api from "./api";
import "./keybinds";

export function Root(): JSX.Element | null {
    const [data, setData] = useState<RendererData>();
    const [listNameType, setListNameType] = useState<ListNameType>();

    useEffect(() => {
        api.getInitialData().then(setData).catch(console.error);
        api.onUpdate(setData);
        api.onCreateList(() => setListNameType("createList"));
        api.onRenameList(() => setListNameType("renameList"));
    }, []);

    if (data == null) {
        return null;
    }

    return (
        <>
            <Titlebar
                activeList={data.config.activeList}
                itemsCount={data.items.length}
                totalCount={data.totalCount}
                pinned={data.config.pinned}
                showSearch={data.config.showSearch}
            />

            {listNameType != null && (
                <ListName
                    type={listNameType}
                    activeList={data.config.activeList}
                    done={() => setListNameType(undefined)}
                />
            )}
            {data.config.showSearch && <Search value={data.search} />}

            <ClipboardList items={data.items} />

            <Footer paused={data.config.paused} autoStar={data.config.autoStar} />
        </>
    );
}
