import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  primary:
    "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 active:bg-emerald-800 disabled:bg-emerald-300",
  secondary:
    "bg-slate-900 hover:bg-slate-800 text-white shadow-sm active:bg-slate-950 disabled:bg-slate-400",
  outline:
    "border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 active:bg-slate-100 disabled:opacity-50",
  ghost:
    "bg-transparent hover:bg-slate-100 text-slate-700 active:bg-slate-200 disabled:opacity-50",
  danger:
    "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 active:bg-rose-800 disabled:bg-rose-300",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-xs rounded-xl font-medium gap-1.5",
  md: "px-4 py-2 text-sm rounded-xl font-medium gap-2",
  lg: "px-6 py-3 text-base rounded-2xl font-semibold gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:cursor-not-allowed select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
