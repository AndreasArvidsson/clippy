import { storage } from "../storage";
import type { SwitchListCommand } from "../types/command";
import { getActiveList, getListByNameIgnoreCase } from "../util/getList";
import { updateRenderer } from "../util/updateRenderer";

export function switchList(command: SwitchListCommand) {
    const { activeList } = getActiveList();
    const namedList = getListByNameIgnoreCase(command.name);

    if (namedList.id === activeList.id) {
        return;
    }

    storage.patchConfig({ activeList: namedList.id });

    updateRenderer();
}
