import { useEffect, useRef, useState } from "react";
import classNames from "./classNames";

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
    onChange: (value: string) => void;
    onBlur?: () => void;
    onEscape?: () => void;
}

export default function InputText({
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
}: Props) {
    const [currentValue, setCurrentValue] = useState("");
    const [timeoutHandle, setTimeoutHandle] = useState<NodeJS.Timeout>();
    const escapeBlurRef = useRef(false);

    useEffect(() => {
        setCurrentValue(value ?? "");
    }, [value]);

    return (
        <input
            type={type ?? "text"}
            className={classNames(
                "form-control",
                {
                    "is-invalid": invalid,
                },
                className,
            )}
            title={title}
            value={currentValue}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            onChange={(e) => {
                setCurrentValue(e.target.value);
                if (timeout) {
                    clearTimeout(timeoutHandle);
                    setTimeoutHandle(setTimeout(() => onChange(e.target.value.trim()), 500));
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
                    onChange(currentValue.trim());
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
