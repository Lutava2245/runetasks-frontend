import React from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "outline" | "ghost" | "destructive";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {

    const baseClasses = clsx(
      "inline-flex items-center justify-center whitespace-nowrap",
      "rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed",
      "h-10 px-2 py-2",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
    );

    const variantClasses = {
      primary: clsx(
        "bg-(--primary) text-white border-2 border-(--primary)",
        "hover:bg-(--dark-primary) hover:border-(--dark-primary) shadow-md hover:shadow-lg"
      ),

      destructive: clsx(
        "bg-(--error) text-white hover:bg-red-800 border-2 border-(--error) hover:border-red-800"
      ),

      outline: clsx(
        "border-2 border-(--primary) bg-transparent text-(--primary)",
        "hover:border-(--dark-primary) hover:text-(--dark-primary)"
      ),

      ghost: clsx(
        "bg-transparent hover:text-(--primary) border-2 border-transparent"
      ),
    };

    return (
      <button
        ref={ref}
        className={clsx(
          baseClasses,
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;