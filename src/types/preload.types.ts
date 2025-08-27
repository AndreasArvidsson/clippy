import type { Command } from "./command";
import type { MenuType, RendererData } from "./types";

export interface PreloadApi {
    getRendererData(): Promise<RendererData>;
    command(command: Command): void;
    menu(menu: MenuType): void;

    onUpdate(callback: (data: RendererData) => void): void;
    onCreateList(callback: () => void): void;
    onRenameList(callback: () => void): void;
    onRenameItem(callback: (id: string) => void): () => void;
}

export interface PreloadPlatform {
    isMacOS: boolean;
}
