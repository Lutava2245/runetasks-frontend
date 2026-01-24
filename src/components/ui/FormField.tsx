import React from 'react';

type FieldLayout = "horizontal" | "vertical";

interface FormProps extends React.InputHTMLAttributes<HTMLInputElement> {
  layout?: FieldLayout;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField = React.forwardRef<HTMLDivElement, FormProps>(
  ({
    layout = "vertical",
    label,
    id,
    type = "text",
    value,
    placeholder,
    defaultValue,
    required = false,
    onChange,
    ...props
  }, ref) => {

    const baseLayoutClasses = layout === "horizontal"
      ? "flex items-center justify-between gap-2.5"
      : "flex flex-col gap-1.5";

    return (
      <div ref={ref} className={`mb-3 ${baseLayoutClasses}`}>
        <label
          htmlFor={id}
          className={`text-sm ${layout === "horizontal" ? "min-w-[120px] text-right" : "font-medium"}`}
        >
          {label}
        </label>

        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          defaultValue={defaultValue}
          onChange={onChange}
          required={required}
          className={`
            flex-1 p-3 w-full border
            border-foreground
            rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-(--primary)
            placeholder-foreground/50 text-sm
          `}
          {...props}
        />
      </div>
    );
  }
)
FormField.displayName = "FormField";

export default FormField;