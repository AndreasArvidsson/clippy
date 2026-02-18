const urlRegex = /^(https?:\/\/|www\.)[\w.:/#?\\-]+$/g;

export function isUrl(text: string): boolean {
    urlRegex.lastIndex = 0; // Reset regex state
    return urlRegex.test(text);
}

export function constructSearchRegexp(text: string): RegExp {
    const parts = text.split(" ");
    // Between each word there can be nothing(camelCase), space, underscore, dash, slash or backslash
    const pattern = parts.join("[\\s_/\\-\\\\]*");
    return new RegExp(pattern, "i");
}
