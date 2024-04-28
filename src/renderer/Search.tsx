import { useState } from "react";
import api from "./api";

interface Props {
    init: string;
}

export function Search({ init }: Props): JSX.Element {
    const [search, setSearch] = useState(init);

    return (
        <input
            type="text"
            className="form-control form-control-sm"
            value={search}
            autoFocus
            placeholder="Search"
            onChange={(e) => {
                setSearch(e.target.value);
                api.searchUpdated(e.target.value);
            }}
        />
    );
}
