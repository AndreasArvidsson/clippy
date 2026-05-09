const urlRegex = /^(https?:\/\/|www\.)[\w.:/#?\\-]+$/gu;

export function isUrl(text: string): boolean {
    // Reset regex state
    urlRegex.lastIndex = 0;
    return urlRegex.test(text);
}
