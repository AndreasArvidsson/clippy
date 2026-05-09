// oxlint-disable typescript/no-non-null-assertion

const refLC = "a".codePointAt(0)!;
const refUC = "A".codePointAt(0)!;

export function indexToHint(index: number): string {
    if (index < 9) {
        return String(index + 1);
    }

    let n = index - 9;
    let hint = "";

    do {
        hint = String.fromCodePoint(refUC + (n % 26)) + hint;
        n = Math.trunc(n / 26) - 1;
    } while (n >= 0);

    return hint;
}

export function hintToIndex(hint: string): number {
    if (/^\d+$/u.test(hint)) {
        return Number.parseInt(hint, 10) - 1;
    }

    if (!/^[a-zA-Z]+$/u.test(hint)) {
        throw new Error(`Invalid hint: ${hint}`);
    }

    let result = 0;

    for (const letter of hint.toLowerCase()) {
        result = result * 26 + (letter.codePointAt(0)! - refLC + 1);
    }

    return result + 8;
}
