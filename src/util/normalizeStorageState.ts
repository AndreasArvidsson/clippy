import { type StorageState, AllList } from "../types/types";

// FIXME 2025-01-03: Remove this when people have had time to update
export function normalizeStorageState(state: StorageState): StorageState {
    if (typeof state.config.activeList !== "string") {
        return {
            ...state,
            config: {
                ...state.config,
                activeList: AllList.id,
            },
        };
    }
    return state;
}
