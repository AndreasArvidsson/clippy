import type { JSX } from "preact";
import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
import { classNames } from "./classNames";

interface Props {
    type?: "text" | "search";
    value?: string;
    placeholder?: string;
    title?: string;
    className?: string;
    disabled?: boolean;
    invalid?: boolean;
    autoFocus?: boolean;
    timeout?: boolean;
    onChange: (value: string, target: HTMLInputElement) => void;
    onBlur?: () => void;
    onEscape?: () => void;
}

export function InputText({
    type,
    value,
    placeholder,
    className,
    disabled,
    title,
    invalid,
    autoFocus,
    timeout,
    onChange,
    onBlur,
    onEscape,
}: Props): JSX.Element {
    const [currentValue, setCurrentValue] = useState("");
    const [timeoutHandle, setTimeoutHandle] = useState<number>();
    const ref = useRef<HTMLInputElement>(null);
    const escapeBlurRef = useRef(false);

    useEffect(() => {
        setCurrentValue(value ?? "");
    }, [value]);

    // Focus the input when it is mounted
    useLayoutEffect(() => {
        if (
            autoFocus &&
            ref.current != null &&
            globalThis.document.activeElement !== ref.current
        ) {
            ref.current.focus({ preventScroll: true });
        }
        // oxlint-disable-next-line eslint-plugin-react-hooks/exhaustive-deps
    }, []);

    return (
        <input
            ref={ref}
            type={type ?? "text"}
            className={classNames(
                "form-control",
                invalid && "is-invalid",
                className,
            )}
            title={title}
            value={currentValue}
            placeholder={placeholder}
            disabled={disabled}
            onClick={(e) => {
                e.stopPropagation();
            }}
            onContextMenu={(e) => {
                e.stopPropagation();
            }}
            onChange={(e) => {
                const newValue = e.currentTarget.value;
                setCurrentValue(newValue);
                if (timeout) {
                    clearTimeout(timeoutHandle);
                    setTimeoutHandle(
                        setTimeout(() => {
                            onChange(newValue.trim(), e.currentTarget);
                        }, 500),
                    );
                }
            }}
            onBlur={() => {
                if (onBlur != null && !escapeBlurRef.current) {
                    onBlur();
                } else {
                    setCurrentValue(value ?? "");
                }
                escapeBlurRef.current = false;
            }}
            onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === "Enter") {
                    onChange(currentValue.trim(), e.currentTarget);
                } else if (e.key === "Escape") {
                    e.preventDefault();
                    if (onEscape != null) {
                        onEscape();
                    } else {
                        escapeBlurRef.current = true;
                        e.currentTarget.blur();
                    }
                }
            }}
        />
    );
}
