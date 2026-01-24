'use client';

import * as React from "react";
import clsx from "clsx";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onChange, min = 0, max = 100, step = 1, ...props }, ref) => {

    const val = value;
    const minNum = Number(min);
    const maxNum = Number(max);

    return (
      <div
        className={clsx(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
      >
        <input
          ref={ref}
          type="range"
          min={minNum}
          max={maxNum}
          step={step}
          value={val}
          onChange={onChange}
          className={clsx(
            "w-full h-2 cursor-pointer appearance-none bg-gray-300 rounded-full",
            "focus:outline-none focus:ring-2 focus:ring-(--primary)",
          )}
          {...props}
        />
      </div>
    );
  }
);
Slider.displayName = "Slider";

export default Slider;