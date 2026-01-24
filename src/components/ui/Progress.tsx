import * as React from "react";
import clsx from "clsx";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, ...props }, ref) => {
    const progressValue = Math.min(100, Math.max(0, value || 0));

    return (
      <div
        ref={ref}
        className={clsx(
          "relative h-4 w-full overflow-hidden rounded-full bg-background border-2 border-(--primary)",
          className
        )}
        role="progressbar"
        aria-valuenow={progressValue}
        aria-valuemin={0}
        aria-valuemax={100}
        {...props}
      >
        <div
          className="h-full bg-(--primary) transition-all duration-500 ease-out"
          style={{ width: `${progressValue}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export default Progress;