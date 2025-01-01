import type { SearchType } from "./types";

export interface PrimitiveTarget {
    type: "primitive";
    hint: string;
    count?: number;
}

export interface RangeTarget {
    type: "range";
    start: string;
    end: string;
}

export interface SearchTarget {
    type: "search";
    offset: number;
    itemType?: SearchType;
    itemText?: string;
}

export type Target = PrimitiveTarget | RangeTarget | SearchTarget;
