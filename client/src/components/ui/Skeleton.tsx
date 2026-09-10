import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "rectangular",
  width,
  height,
  className = "",
  style,
  ...props
}) => {
  const variantStyles = {
    text: "rounded h-4 w-full",
    circular: "rounded-full shrink-0",
    rectangular: "rounded-none",
    rounded: "rounded-2xl",
  }[variant];

  const customStyle: React.CSSProperties = {
    ...(width !== undefined ? { width } : {}),
    ...(height !== undefined ? { height } : {}),
    ...style,
  };

  return (
    <div
      className={`animate-pulse bg-slate-200/80 ${variantStyles} ${className}`}
      style={customStyle}
      {...props}
    />
  );
};
