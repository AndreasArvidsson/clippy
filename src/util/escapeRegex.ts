const regexMetaChars = /[\\^$.*+?()[\]{}|]/gu;

export function escapeRegex(text: string): string {
    return text.replace(regexMetaChars, String.raw`\$&`);
}
