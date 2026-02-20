import { ChevronDown } from 'lucide-react';
import * as React from 'react';

interface Option {
  id: string | number;
  name: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange: (value: string) => void;
  label: string;
  options: Option[];
  placeholder?: string;
  [key: string]: any;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({
    label,
    id,
    value,
    onValueChange,
    options,
    placeholder = "Selecione",
    ...props
  }, ref) => {

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      onValueChange(event.target.value);
    };

    return (
      <div className="mb-3 flex flex-col gap-1.5">
        <label
          htmlFor={id}
          className="text-md font-medium block"
        >
          {label}
        </label>

        <select
          id={id}
          ref={ref}
          value={value}
          onChange={handleChange}
          className={`
            flex-1 p-1 w-full border-b-2 rounded-t-lg
            bg-background/30
            focus:outline-none focus:border-(--primary) transition-all
            text-sm
          `}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((option: Option) => (
            <option
              key={option.id}
              value={option.value}
            >
              {option?.name || option.value}
            </option>
          ))}
        </select>
      </div>
    );
  }
);
Select.displayName = "Select";

export default Select;