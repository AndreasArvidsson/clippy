const runModes = ["production", "development", "test"] as const;
type RunMode = (typeof runModes)[number];

const mode = ((): RunMode => {
    switch (process.env.CLIPPY_MODE) {
        case undefined:
        case "production":
            return "production";
        case "development":
            return "development";
        case "test":
            return "test";
        default:
            throw new Error(`Invalid CLIPPY_MODE: ${process.env.CLIPPY_MODE}`);
    }
})();

export function isProduction(): boolean {
    return mode === "production";
}
