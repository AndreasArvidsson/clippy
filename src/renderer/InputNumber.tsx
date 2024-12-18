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
    onChange?: (value: number) => void;
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
    children,
}: Props) {
    const [currentValue, setCurrentValue] = useState("");

    useEffect(() => {
        setCurrentValue(value.toString());
    }, [value]);

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const num = isInteger ? parseInt(e.target.value) : parseFloat(e.target.value);
        if (isNaN(num)) {
            setCurrentValue(value.toString());
        } else {
            setCurrentValue(num.toString());
            onChange!(num);
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
                onBlur={onChange ? onBlur : undefined}
                onKeyDown={(e) => e.stopPropagation()}
            />
        </div>
    );
}
