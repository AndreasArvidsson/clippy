import type { List } from "../types/types";
import api from "./api";

export type ListNameType = "createList" | "renameList";

interface Props {
    type: ListNameType;
    activeList: List;
    done: () => void;
}
export function ListName({ type, activeList, done }: Props): JSX.Element {
    const isCreate = type === "createList";
    const defaultValue = isCreate ? undefined : activeList.name;
    return (
        <div>
            <input
                autoFocus
                className="form-control form-control-sm"
                type="search"
                defaultValue={defaultValue}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter") {
                        const name = e.currentTarget.value.trim();
                        done();
                        api.command({ id: type, name });
                    } else if (e.key === "Escape") {
                        done();
                    }
                }}
            />
        </div>
    );
}
