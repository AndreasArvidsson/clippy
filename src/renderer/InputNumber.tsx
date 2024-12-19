import { useEffect, useState } from "react";
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
    onBlur?: () => void;
    children?: React.ReactNode;
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

    useEffect(() => {
        setCurrentValue(value.toString());
    }, [value]);

    const myOnChange = () => {
        const num = isInteger ? parseInt(currentValue) : parseFloat(currentValue);
        if (isNaN(num)) {
            setCurrentValue(value.toString());
        } else {
            setCurrentValue(num.toString());
            if (value !== num) {
                onChange(num);
            }
        }
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
                onChange={(e) => setCurrentValue(e.target.value)}
                onBlur={() => {
                    setCurrentValue(value.toString());
                    onBlur?.();
                }}
                onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter") {
                        myOnChange();
                    } else if (e.key === "Escape") {
                        e.preventDefault();
                        e.currentTarget.blur();
                    }
                }}
            />
        </div>
    );
}
