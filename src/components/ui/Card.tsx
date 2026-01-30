import React from "react";
import clsx from "clsx";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={clsx("p-4 rounded-lg border-(--card) bg-(--card) shadow-sm", className)} {...props} />
));
Card.displayName = "Card";

export default Card;
