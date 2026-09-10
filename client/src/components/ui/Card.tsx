import React, { forwardRef } from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "bordered" | "flat";
  hoverEffect?: boolean;
}

const variantStyles: Record<string, string> = {
  default: "bg-white border border-slate-100 shadow-sm",
  glass: "bg-white/80 backdrop-blur-md border border-white/20 shadow-lg",
  bordered: "bg-white border border-slate-200 shadow-none",
  flat: "bg-slate-50 border-none shadow-none",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = "default",
      hoverEffect = false,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`rounded-3xl transition-all duration-300 ${variantStyles[variant]} ${
          hoverEffect
            ? "hover:-translate-y-1 hover:shadow-xl hover:border-slate-200"
            : ""
        } ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
