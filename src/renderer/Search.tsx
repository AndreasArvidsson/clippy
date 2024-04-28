import { useEffect, useState } from "react";
import api from "./api";

interface Props {
    value: string;
}

export function Search({ value }: Props): JSX.Element {
    const [search, setSearch] = useState("");

    useEffect(() => {
        setSearch(value);
    }, [value]);

    return (
        <input
            type="text"
            className="form-control form-control-sm"
            value={search}
            autoFocus
            placeholder="Search"
            onKeyDown={(e) => {
                if (e.key === "Escape") {
                    e.currentTarget.blur();
                }
                e.stopPropagation();
            }}
            onChange={(e) => {
                setSearch(e.target.value);
                api.command({ id: "search", value: e.target.value });
            }}
        />
    );
}
