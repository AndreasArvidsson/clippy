import crypto from "node:crypto";

export function createHash(str: string): string {
    return crypto.createHash("sha256").update(str).digest("hex");
}
