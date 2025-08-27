export {};

declare global {
    interface Window {
        api: {
            getRendererData(): Promise<RendererData>;
            command(command: Command): void;
            menu(menu: MenuType): void;
            onUpdate(callback: (data: RendererData) => void): void;
            onCreateList(callback: () => void): void;
            onRenameList(callback: () => void): void;
            onRenameItem(callback: (id: string) => void): () => void;
        };

        platform: {
            isMacOS: boolean;
        };
    }
}
