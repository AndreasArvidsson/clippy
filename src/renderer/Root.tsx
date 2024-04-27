import { useEffect, useState } from "react";
import type { ClipItem } from "../types/ClipboardItem";
import { ClipboardList } from "./ClipboardList";
import api from "./api";

export function Root(): JSX.Element {
    const [items, setItems] = useState<ClipItem[]>([]);
    const [itemsFiltered, setItemsFiltered] = useState<ClipItem[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        api.onClipboardUpdate(setItems);
    }, []);

    useEffect(() => {
        const text = search.trim().toLowerCase();
        if (text) {
            setItemsFiltered(
                items.filter(
                    (item) => item.type === "text" && item.text.toLowerCase().includes(text),
                ),
            );
        } else {
            setItemsFiltered(items);
        }
    }, [items, search]);

    return (
        <>
            <input
                type="text"
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
            />

            <ClipboardList items={itemsFiltered} />
        </>
    );
}
