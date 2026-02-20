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
      <div className='mb-3 flex flex-col gap-1.5'>
        <label
          htmlFor={id}
          className="text-md font-medium"
        >
          {label}
        </label>

        <input
          id={id}
          ref={ref}
          type="date"
          onChange={handleChange}
          className={`
            flex-1 p-1 w-full border-b-2 rounded-t-lg
            bg-background/30
            focus:outline-none focus:border-(--primary) transition-all
            text-sm
          `}
          {...props}
        />
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";

export { DatePicker };