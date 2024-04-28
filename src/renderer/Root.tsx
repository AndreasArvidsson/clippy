import { useEffect, useState } from "react";
import type { InitialData } from "../types/types";
import { ClipboardList } from "./ClipboardList";
import { Search } from "./Search";
import { Titlebar } from "./Titlebar";
import api from "./api";

export function Root(): JSX.Element {
    const [data, setData] = useState<InitialData>();

    useEffect(() => {
        api.getInitialData().then(setData).catch(console.error);
    }, []);

    if (data == null) {
        return <Titlebar />;
    }

    return (
        <>
            <Titlebar />

            <main>
                <Search init={data.search} />

                <ClipboardList init={data.items} />
            </main>
        </>
    );
}
