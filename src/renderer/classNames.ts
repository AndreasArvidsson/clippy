export default function classNames(
    ...args: (string | undefined | Record<string, boolean | undefined>)[]
): string | undefined {
    const classes: string[] = [];

    for (const arg of args) {
        if (!arg) {
            continue;
        }

        if (typeof arg === "string") {
            classes.push(arg);
        } else {
            for (const [cls, active] of Object.entries(arg)) {
                if (active) {
                    classes.push(cls);
                }
            }
        }
    }

    if (classes.length === 0) {
        return undefined;
    }

    return classes.join(" ");
}
