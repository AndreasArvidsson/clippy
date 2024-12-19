import { apiRenderer } from "../api";
import type { List } from "../types/types";
import InputText from "./InputText";

export type ListNameType = "createList" | "renameList";

interface Props {
    type: ListNameType | undefined;
    activeList: List;
    done: () => void;
}
export function ListName({ type, activeList, done }: Props): JSX.Element | null {
    if (type == null) {
        return null;
    }

    const isCreate = type === "createList";
    const defaultValue = isCreate ? undefined : activeList.name;
    return (
        <div>
            <InputText
                className="form-control-sm"
                autoFocus
                placeholder="List name"
                value={defaultValue}
                onBlur={() => done()}
                onChange={(value) => {
                    done();
                    apiRenderer.command({ id: type, name: value });
                }}
            />
        </div>
    );
}
