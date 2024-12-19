import { useEffect, useState } from "react";
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
    onChange: (value: string) => void;
    onBlur?: () => void;
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
    onChange,
    onBlur,
}: Props) {
    const [currentValue, setCurrentValue] = useState("");

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
            onChange={(e) => setCurrentValue(e.target.value)}
            onBlur={() => {
                setCurrentValue(value ?? "");
                onBlur?.();
            }}
            onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === "Enter") {
                    onChange(currentValue.trim());
                } else if (e.key === "Escape") {
                    e.preventDefault();
                    e.currentTarget.blur();
                }
            }}
        />
    );
}
