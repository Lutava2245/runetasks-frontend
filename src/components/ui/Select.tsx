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
      <div className="relative">
        <label
          htmlFor={id}
          className="text-sm font-bold mb-1 block"
        >
          {label}
        </label>

        <select
          id={id}
          ref={ref}
          value={value}
          onChange={handleChange}
          className={`
            flex-1 p-3 w-full border appearance-none
            border-foreground
            rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-(--primary)
            placeholder-foreground/50 text-sm
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

        <div className="absolute inset-y-12 text-center right-0 flex items-center px-3 pointer-events-none">
          <ChevronDown className='w-5 h-5'/>
        </div>
      </div>
    );
  }
);
Select.displayName = "Select";

export default Select;