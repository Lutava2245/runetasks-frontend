import React from 'react';

interface FormProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField = React.forwardRef<HTMLDivElement, FormProps>(
  ({
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


    return (
      <div ref={ref} className={`mb-3 flex flex-col gap-1.5`}>
        <label
          htmlFor={id}
          className={`text-md font-medium`}
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
            flex-1 p-1 w-full border-b-2 rounded-t-lg
            bg-background/30
            focus:outline-none focus:border-(--primary) transition-all
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