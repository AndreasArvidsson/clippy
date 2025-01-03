let lastTimestamp = 0;
let count = 0;

// Serializes timestamp an adds count if needed to be unique
export function getNextClipItemId(timestamp: number): string {
    if (timestamp !== lastTimestamp) {
        lastTimestamp = timestamp;
        count = 1;
        return timestamp.toString();
    }

    return `${timestamp}-${count++}`;
}
