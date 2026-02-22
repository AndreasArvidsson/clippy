type Arg = string | undefined | false;

export default function classNames(...args: Arg[]): string | undefined {
    return args.filter(Boolean).join(" ") || undefined;
}
