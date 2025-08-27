import type { PreloadApi, PreloadPlatform } from "../types/preload.types";

declare global {
    interface Window {
        api: PreloadApi;
        platform: PreloadPlatform;
    }
}

export {};
