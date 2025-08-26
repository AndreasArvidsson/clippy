import type { JSX } from "preact";
import { apiRenderer } from "../api";
import type { ClipItemType, Search } from "../types/types";
import InputText from "./InputText";

interface Props {
    search: Search;
}

export function Search({ search }: Props): JSX.Element | null {
    function onChange(change: Partial<Search>) {
        const value = { ...search, ...change };
        apiRenderer.command({ id: "searchItems", text: value.text, type: value.type });
    }

    if (!search.show) {
        return null;
    }

    return (
        <div className="search input-group">
            <InputText
                type="search"
                className="form-control-sm"
                placeholder="Search"
                autoFocus
                timeout
                value={search.text}
                onChange={(value) => onChange({ text: value })}
                onBlur={() => {}} // Do nothing
                onEscape={() => apiRenderer.command({ id: "hideSearch" })}
            />

            <span>
                <select
                    className="form-select form-select-sm"
                    value={search.type}
                    onChange={(e) => {
                        const value = e.currentTarget.value || undefined;
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
