import { apiRenderer } from "../api";
import InputText from "./InputText";

export type ListNameType = "createList" | "renameList";

interface Props {
    type: ListNameType | undefined;
    activeListName: string;
    done: () => void;
}
export function ListName({ type, activeListName, done }: Props): JSX.Element | null {
    if (type == null) {
        return null;
    }

    const isCreate = type === "createList";
    const defaultValue = isCreate ? undefined : activeListName;
    return (
        <div>
            <InputText
                className="form-control-sm"
                autoFocus
                placeholder="List name"
                value={defaultValue}
                onBlur={() => done()}
                onEscape={() => done()}
                onChange={(value) => {
                    done();
                    apiRenderer.command({ id: type, name: value });
                }}
            />
        </div>
    );
}
