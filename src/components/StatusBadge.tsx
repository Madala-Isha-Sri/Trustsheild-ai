import { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';
import { ShieldCheck, ShieldAlert, Shield, Loader2, CheckCircle2, XCircle } from 'lucide-react';

type StatusType = 'running' | 'thinking' | 'safe' | 'warning' | 'danger' | 'success' | 'authentic' | 'counterfeit';

interface StatusBadgeProps extends HTMLAttributes<HTMLDivElement> {
  status: StatusType;
  text?: string;
}

export function StatusBadge({ status, text, className, ...props }: StatusBadgeProps) {
  const config = {
    running: { bg: 'bg-primary/20', text: 'text-primary', border: 'border-primary/30', icon: Loader2, animate: 'animate-spin' },
    thinking: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', icon: Loader2, animate: 'animate-pulse' },
    safe: { bg: 'bg-success/20', text: 'text-success', border: 'border-success/30', icon: ShieldCheck, animate: '' },
    success: { bg: 'bg-success/20', text: 'text-success', border: 'border-success/30', icon: CheckCircle2, animate: '' },
    authentic: { bg: 'bg-success/20', text: 'text-success', border: 'border-success/30', icon: CheckCircle2, animate: '' },
    warning: { bg: 'bg-warning/20', text: 'text-warning', border: 'border-warning/30', icon: Shield, animate: '' },
    danger: { bg: 'bg-danger/20', text: 'text-danger', border: 'border-danger/30', icon: ShieldAlert, animate: '' },
    counterfeit: { bg: 'bg-danger/20', text: 'text-danger', border: 'border-danger/30', icon: XCircle, animate: '' },
  };

  const { bg, text: textColor, border, icon: Icon, animate } = config[status];

  return (
    <div
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-md",
        bg, textColor, border, className
      )}
      {...props}
    >
      <Icon className={cn("w-3.5 h-3.5 mr-1.5", animate)} />
      {text || status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
}
