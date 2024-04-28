import { useEffect, useState } from "react";
import type { ClipItem } from "../types/ClipboardItem";
import { ClipboardList } from "./ClipboardList";
import api from "./api";

export function Root(): JSX.Element {
    const [items, setItems] = useState<ClipItem[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        api.onClipboardUpdate(setItems);
    }, []);

    return (
        <>
            <input
                type="text"
                className="form-control"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    api.searchUpdated(e.target.value);
                }}
                placeholder="Search"
            />

            <ClipboardList items={items} />
        </>
    );
}
