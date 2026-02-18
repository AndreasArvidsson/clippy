const urlRegex = /^(https?:\/\/|www\.)[\w.:/#?\\-]+$/g;

export function isUrl(text: string): boolean {
    urlRegex.lastIndex = 0; // Reset regex state
    return urlRegex.test(text);
}
