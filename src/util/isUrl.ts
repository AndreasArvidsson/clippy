const urlRegex = /^(https?:\/\/|www\.)[\w.:/#?\\-]+$/g;

export function isUrl(text: string): boolean {
    // Reset regex state
    urlRegex.lastIndex = 0;
    return urlRegex.test(text);
}
