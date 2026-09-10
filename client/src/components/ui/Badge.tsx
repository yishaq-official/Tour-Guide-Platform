import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "emerald" | "sky" | "amber" | "rose" | "slate" | "purple";
  size?: "sm" | "md";
  dot?: boolean;
}

const badgeVariants: Record<string, string> = {
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  sky: "bg-sky-50 text-sky-700 border-sky-200/60",
  amber: "bg-amber-50 text-amber-800 border-amber-200/60",
  rose: "bg-rose-50 text-rose-700 border-rose-200/60",
  slate: "bg-slate-100 text-slate-700 border-slate-200/80",
  purple: "bg-purple-50 text-purple-700 border-purple-200/60",
};

const dotVariants: Record<string, string> = {
  emerald: "bg-emerald-500",
  sky: "bg-sky-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
  slate: "bg-slate-500",
  purple: "bg-purple-500",
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "emerald",
  size = "md",
  dot = false,
  className = "",
  ...props
}) => {
  const sizeStyle = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs font-medium";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-colors ${badgeVariants[variant]} ${sizeStyle} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotVariants[variant]}`} />}
      {children}
    </span>
  );
};
