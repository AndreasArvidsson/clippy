import classNames from "./classNames";

interface Props {
    className?: string;
    checked?: boolean;
    title?: string;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
    children?: React.ReactNode;
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
            <label>
                <input
                    type="checkbox"
                    className="form-check-input"
                    checked={checked}
                    title={title}
                    disabled={disabled}
                    onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
                />
                {children}
            </label>
        </div>
    );
}
