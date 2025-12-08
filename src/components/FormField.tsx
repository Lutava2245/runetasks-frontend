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
          className={`text-sm text-gray-400 ${layout === "horizontal" ? "min-w-[120px] text-right" : "font-medium"}`}
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
            border-gray-300
            rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            text-gray-900
            placeholder-gray-400
          `}
          {...props}
        />
      </div>
    );
  }
)
FormField.displayName = "FormField";

export default FormField;