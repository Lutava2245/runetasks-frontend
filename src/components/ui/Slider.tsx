import * as React from "react";
import Badge from "./Badge";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ id, label, value, onChange, min = 0, max = 100, step = 1, ...props }, ref) => {

    const val = value;
    const minNum = Number(min);
    const maxNum = Number(max);

    return (
      <div>
        <label
          htmlFor={id}
          className="text-sm font-bold mb-2 block"
        >
          {label}
        </label>

        <div className="flex items-center gap-4 p-3 rounded-lg border">
          <input
            ref={ref}
            type="range"
            min={minNum}
            max={maxNum}
            step={step}
            value={val}
            onChange={onChange}
            className={`
              w-full h-2 cursor-pointer appearance-none
              bg-foreground/25 rounded-full
              focus:outline-none focus:ring-2 focus:ring-(--primary)
            `}
            {...props}
          />

          <Badge className="w-10 justify-center">{value}</Badge>
        </div>
      </div>
    );
  }
);
Slider.displayName = "Slider";

export default Slider;