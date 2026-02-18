const regexMetaChars = /[\\^$.*+?()[\]{}|]/g;

export function escapeRegex(text: string): string {
    return text.replace(regexMetaChars, "\\$&");
}
