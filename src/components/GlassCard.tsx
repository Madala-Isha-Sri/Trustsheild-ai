import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../utils/cn';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hoverEffect = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glass-card",
          hoverEffect && "hover:shadow-2xl hover:border-white/20 hover:-translate-y-1",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
