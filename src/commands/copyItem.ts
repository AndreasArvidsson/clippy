import { getWindow } from "../window";
import * as clipboard from "../clipboard";
import * as clipboardList from "../clipboardList";

export function copyItem(number: number) {
    const item = clipboardList.get(number);

    if (item == null) {
        throw Error(`Item ${number} not found`);
    }

    clipboard.write(item);

    getWindow().setFocusable(false);

    setTimeout(() => {
        getWindow().setFocusable(true);
    }, 100);
}
