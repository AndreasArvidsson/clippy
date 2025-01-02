export function parseHintKey(key: string): { superKey: boolean; hint: string } | null {
    let superKey = false;
    if (key.startsWith("super+")) {
        superKey = true;
        key = key.slice(6);
    }
    if (isHint(key)) {
        return { superKey, hint: key.toUpperCase() };
    }
    return null;
}

function isHint(key: string): boolean {
    return /^[a-zA-Z0-9]$/.test(key);
}
