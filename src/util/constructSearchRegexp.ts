import { escapeRegex } from "./escapeRegex";

export function constructSearchRegexp(text: string): RegExp | undefined {
    const parts = text.split(/\s+/).filter(Boolean).map(escapeRegex);

    if (parts.length === 0) {
        return undefined;
    }

    // Between each word there can be nothing(camelCase), space, underscore, dash, slash or backslash
    const pattern = parts.join("[\\s_/\\-\\\\]*");
    return new RegExp(pattern, "i");
}
