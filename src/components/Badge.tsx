import * as React from "react";
import clsx from "clsx";

type BadgeVariant = "primary" | "secondary" | "outline" | "destructive"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "primary", ...props }, ref) => {

    const baseClasses = clsx(
      "inline-flex items-center",
      "rounded-full border text-xs font-semibold transition-colors",
      "px-2 py-0.5",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    );

    const variantClasses = {
      primary: clsx("border-transparent bg-primary text-primary-foreground hover:bg-primary/80"),
      secondary: clsx("border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"),
      destructive: clsx("border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80"),
      outline: clsx("text-foreground"),
    };

    return (
      <div ref={ref} className={clsx(baseClasses, variantClasses[variant], className)} {...props} />
    );
  }
);
Badge.displayName = "Badge";

export default Badge;