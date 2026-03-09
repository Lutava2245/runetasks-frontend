import * as React from "react";
import Badge from "./Badge";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  badge: string;
  value: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ id, label, badge, value, onChange, min = 0, max = 100, step = 1, ...props }, ref) => {

    const minNum = Number(min);
    const maxNum = Number(max);

    return (
      <div className="mb-3 flex flex-col gap-1.5">
        <label
          htmlFor={id}
          className="text-md font-medium"
        >
          {label}
        </label>

        <div className="flex items-center gap-4">
          <input
            ref={ref}
            type="range"
            min={minNum}
            max={maxNum}
            step={step}
            value={value}
            onChange={onChange}
            className={`
              w-full h-2 cursor-pointer appearance-none
              bg-background/30 rounded-full transition-all
              focus:outline-none focus:bg-(--dark-primary)
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:bg-(--primary)
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-md
              [&::-moz-range-thumb]:bg-(--primary)
              [&::-moz-range-thumb]:w-4
              [&::-moz-range-thumb]:h-4
              [&::-moz-range-thumb]:rounded-md
              [&::-moz-range-thumb]:border-0
            `}
            {...props}
          />

          <Badge className="w-16 justify-center">{badge}</Badge>
        </div>
      </div>
    );
  }
);
Slider.displayName = "Slider";

export default Slider;