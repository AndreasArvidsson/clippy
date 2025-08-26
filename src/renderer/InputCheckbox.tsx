import type { ComponentChildren, JSX } from "preact";
import classNames from "./classNames";

interface Props {
    className?: string;
    checked?: boolean;
    title?: string;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
    children?: ComponentChildren;
}

export default function InputCheckbox({
    className,
    checked,
    title,
    disabled,
    onChange,
    children,
}: Props): JSX.Element {
    return (
        <div className={classNames("form-check", className)}>
            <label title={title}>
                <input
                    type="checkbox"
                    className="form-check-input"
                    checked={checked}
                    disabled={disabled}
                    onChange={onChange ? (e) => onChange(e.currentTarget.checked) : undefined}
                />
                {children}
            </label>
        </div>
    );
}
