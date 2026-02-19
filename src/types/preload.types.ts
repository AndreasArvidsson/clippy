import type { Command } from "./command";
import type { Disposable, MenuType, RendererData } from "./types";

export interface PreloadApi {
    getRendererData(): Promise<RendererData>;
    command(command: Command): void;
    menu(menu: MenuType): void;

    onUpdate(callback: (data: RendererData) => void): Disposable;
    onCreateList(callback: () => void): Disposable;
    onRenameList(callback: () => void): Disposable;
    onRenameItem(callback: (id: string) => void): Disposable;
}

export interface PreloadPlatform {
    isMacOS: boolean;
}
