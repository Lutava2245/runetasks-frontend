'use client';

import * as React from 'react';

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  onValueChange?: (value: string) => void;
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ id, label, className, onValueChange, ...props }, ref) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onValueChange) {
        onValueChange(e.target.value);
      }
    };

    return (
      <div>
        <label
          htmlFor={id}
          className="text-sm font-bold mb-1 block"
        >
          {label}
        </label>

        <input
          id={id}
          ref={ref}
          type="date"
          onChange={handleChange}
          className={`
            flex-1 p-3 w-full border appearance-none
            border-foreground text-sm
            rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-(--primary)
          `}
          {...props}
        />
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";

export { DatePicker };