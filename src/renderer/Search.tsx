import { useEffect, useState } from "react";
import type { ClipItemType, Search } from "../types/types";
import api from "./api";

interface Props {
    value: Search;
}

export function Search({ value }: Props): JSX.Element {
    const [search, setSearch] = useState<Search>({});

    useEffect(() => {
        setSearch(value);
    }, [value]);

    function onChange(change: Partial<Search>) {
        const value = { ...search, ...change };
        setSearch(value);
        api.command({ id: "search", text: value.text, type: value.type });
    }

    return (
        <div className="search input-group">
            <input
                type="text"
                className="form-control form-control-sm"
                value={search.text ?? ""}
                autoFocus
                placeholder="Search"
                onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        e.currentTarget.blur();
                    }
                    e.stopPropagation();
                }}
                onChange={(e) => {
                    onChange({ text: e.target.value });
                }}
            />

            <span>
                <select
                    className="form-select form-select-sm"
                    value={search.type}
                    onChange={(e) => {
                        const value = e.target.value || undefined;
                        onChange({ type: value as ClipItemType });
                    }}
                >
                    <option value="">All types</option>
                    <option value="text">Texts</option>
                    <option value="image">Images</option>
                </select>
            </span>
        </div>
    );
}
