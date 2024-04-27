import * as clipboardList from "../clipboardList";
import * as clipboard from "../clipboard";

export function copyItem(number: number) {
    const item = clipboardList.get(number);

    if (item == null) {
        throw Error(`Item ${number} not found`);
    }

    clipboard.write(item);
}
