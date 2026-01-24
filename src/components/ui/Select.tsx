'use client';

import * as React from 'react';
import clsx from 'clsx';

interface Option {
  id: string | number;
  name: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  onValueChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  [key: string]: any;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({
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
        <select
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

        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    );
  }
);
Select.displayName = "Select";

export default Select;