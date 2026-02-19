import type { JSX } from "preact";
import { useEffect, useState } from "preact/hooks";
import type { Disposable, RendererData } from "../types/types";
import { ClipboardList } from "./ClipboardList";
import { Footer } from "./Footer";
import type { ListNameType } from "./ListName";
import { ListName } from "./ListName";
import { Search } from "./Search";
import { Settings } from "./Settings";
import { Titlebar } from "./Titlebar";
import { keyListeners } from "./keyListeners";

export function Root(): JSX.Element | null {
    const [data, setData] = useState<RendererData>();
    const [listNameType, setListNameType] = useState<ListNameType>();

    useEffect(() => {
        window.api.getRendererData().then(setData).catch(console.error);

        const disposables: Disposable[] = [
            window.api.onUpdate(setData),
            window.api.onCreateList(() => setListNameType("createList")),
            window.api.onRenameList(() => setListNameType("renameList")),
            keyListeners.initialize(),
        ];

        return () => {
            disposables.forEach((d) => d.dispose());
        };
    }, []);

    if (data == null) {
        return null;
    }

    const renderBody = () => {
        if (data.showSettings) {
            return <Settings config={data.config} />;
        }

        return (
            <>
                <ListName
                    type={listNameType}
                    activeListName={data.activeListName}
                    done={() => setListNameType(undefined)}
                />

                <Search search={data.search} />

                <ClipboardList items={data.items} />
            </>
        );
    };

    return (
        <>
            <Titlebar
                activeListName={data.activeListName}
                itemsCount={data.items.length}
                totalCount={data.totalCount}
                pinned={data.config.pinned}
                showSearch={data.search.show}
                showSettings={data.showSettings}
            />

            {renderBody()}

            <Footer
                paused={data.config.paused}
                autoStar={data.config.autoStar}
                showSettings={data.showSettings}
            />
        </>
    );
}
