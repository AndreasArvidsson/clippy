import {
    COMMAND,
    CREATE_LIST,
    GET_RENDERER_DATA,
    MENU,
    RENAME_ITEM,
    RENAME_LIST,
    UPDATE,
} from "../constants";
import type { Command } from "../types/command";
import type { MenuType, RendererData } from "../types/types";

export const apiRenderer = {
    // Send events to main thread
    getRendererData(): Promise<RendererData> {
        return window.api.invoke(GET_RENDERER_DATA) as Promise<RendererData>;
    },
    command(command: Command) {
        window.api.send(COMMAND, command);
    },
    menu(menu: MenuType) {
        window.api.send(MENU, menu);
    },
    // Listen for events from main thread
    onUpdate(callback: (data: RendererData) => void) {
        window.api.on(UPDATE, (...args: unknown[]) => callback(args[0] as RendererData));
    },
    onCreateList(callback: () => void) {
        window.api.on(CREATE_LIST, () => callback());
    },
    onRenameList(callback: () => void) {
        window.api.on(RENAME_LIST, () => callback());
    },
    onRenameItem(callback: (id: string) => void) {
        return window.api.on(RENAME_ITEM, (...args: unknown[]) => callback(args[0] as string));
    },
};
