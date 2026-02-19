const refLC = "a".charCodeAt(0);
const refUC = "A".charCodeAt(0);

export function indexToHint(index: number): string {
    if (index < 9) {
        return String(index + 1);
    }

    let n = index - 9;
    let hint = "";

    do {
        hint = String.fromCharCode(refUC + (n % 26)) + hint;
        n = Math.trunc(n / 26) - 1;
    } while (n >= 0);

    return hint;
}

export function hintToIndex(hint: string): number {
    if (/^\d+$/.test(hint)) {
        return parseInt(hint, 10) - 1;
    }

    if (!/^[a-zA-Z]+$/.test(hint)) {
        throw new Error(`Invalid hint: ${hint}`);
    }

    let result = 0;

    for (const letter of hint.toLowerCase()) {
        result = result * 26 + (letter.charCodeAt(0) - refLC + 1);
    }

    return result + 8;
}
