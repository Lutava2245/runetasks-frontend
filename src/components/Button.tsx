import React from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {

    const baseClasses = clsx(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap",
      "rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed",
      "h-10 px-5 py-2",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    );

    const variantClasses = {
      primary: clsx(
        "bg-blue-600 text-white border-2 border-blue-600",
        "hover:bg-blue-700 shadow-md hover:shadow-lg"
      ),

      secondary: clsx(
        "bg-gray-200 text-gray-800 border-2 border-gray-200",
        "hover:bg-gray-300 shadow-md"
      ),

      destructive: clsx(
        "bg-red-600 text-white hover:bg-red-700 border-2 border-red-600"
      ),

      outline: clsx(
        "border-2 border-blue-600 bg-transparent text-blue-600",
        "hover:bg-blue-50/50"
      ),

      ghost: clsx(
        "bg-transparent text-gray-800 hover:bg-gray-200 border-2 border-transparent"
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