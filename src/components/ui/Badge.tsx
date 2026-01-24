import * as React from "react";
import clsx from "clsx";

const Badge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={
    clsx("inline-flex items-center",
      "rounded-full border text-xs font-semibold transition-colors",
      "px-2 py-0.5",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      className)} {...props} />
));
Badge.displayName = "Badge";

export default Badge;