export {};

declare global {
    interface Window {
        api: {
            invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;
            send: (channel: string, ...args: unknown[]) => void;
            on: (channel: string, listener: (...args: unknown[]) => void) => () => void;
            off: (channel: string, listener: (...args: unknown[]) => void) => void;
        };

        platform: {
            isMacOS: boolean;
        };
    }
}
