import type { ComponentChildren } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import classNames from "./classNames";

export interface Props {
    isInteger?: boolean;
    value: number;
    placeholder?: string;
    title?: string;
    className?: string;
    disabled?: boolean;
    invalid?: boolean;
    autoFocus?: boolean;
    onChange: (value: number) => void;
    onBlur?: (value: number) => void;
    children?: ComponentChildren;
}

export default function InputNumber({
    isInteger,
    value,
    placeholder,
    title,
    className,
    disabled,
    invalid,
    autoFocus,
    onChange,
    onBlur,
    children,
}: Props) {
    const [currentValue, setCurrentValue] = useState("");
    const escapeBlurRef = useRef(false);

    useEffect(() => {
        setCurrentValue(value.toString());
    }, [value]);

    const parseCurrentValue = () => {
        const num = isInteger
            ? parseInt(currentValue)
            : parseFloat(currentValue);
        return isNaN(num) ? value : num;
    };

    return (
        <div className="input-group" title={title}>
            <span className="input-group-text">{children}</span>
            <input
                type="text"
                className={classNames(
                    "form-control",
                    {
                        "is-invalid": invalid,
                    },
                    className,
                )}
                value={currentValue}
                placeholder={placeholder}
                disabled={disabled}
                autoFocus={autoFocus}
                onChange={(e) => setCurrentValue(e.currentTarget.value)}
                onBlur={() => {
                    if (onBlur != null && !escapeBlurRef.current) {
                        const num = parseCurrentValue();
                        setCurrentValue(num.toString());
                        onBlur(num);
                    } else {
                        setCurrentValue(value.toString());
                    }
                    escapeBlurRef.current = false;
                }}
                onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter") {
                        const num = parseCurrentValue();
                        setCurrentValue(num.toString());
                        if (value !== num) {
                            onChange(num);
                        }
                    } else if (e.key === "Escape") {
                        e.preventDefault();
                        escapeBlurRef.current = true;
                        e.currentTarget.blur();
                    }
                }}
            />
        </div>
    );
}
