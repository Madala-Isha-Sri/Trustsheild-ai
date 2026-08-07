import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../utils/cn";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    const variants = {
      primary: "bg-gradient-to-r from-primary to-cyan-500 hover:from-primary.hover hover:to-cyan-600 text-white shadow-lg shadow-primary/25 border-transparent",
      secondary: "bg-surfaceLight hover:bg-surfaceLight/80 text-white border-white/10",
      outline: "bg-transparent hover:bg-white/5 text-gray-300 border-white/20",
      ghost: "bg-transparent hover:bg-white/5 text-gray-300 border-transparent",
      danger: "bg-danger hover:bg-danger/90 text-white shadow-lg shadow-danger/25 border-transparent",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-12 px-8 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-xl border font-medium transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
