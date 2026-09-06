import React from 'react';
import { Info, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, Quote } from 'lucide-react';

type CalloutType = 'note' | 'tip' | 'warning' | 'danger' | 'quote' | 'info';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const calloutStyles: Record<
  CalloutType,
  { border: string; bg: string; text: string; icon: React.ComponentType<{ className?: string }> }
> = {
  note: {
    border: 'border-l-paper-blue',
    bg: 'bg-paper-blue/5',
    text: 'text-paper-blue',
    icon: Info,
  },
  tip: {
    border: 'border-l-paper-green',
    bg: 'bg-paper-green/5',
    text: 'text-paper-green',
    icon: CheckCircle2,
  },
  warning: {
    border: 'border-l-amber-500',
    bg: 'bg-amber-500/5',
    text: 'text-amber-500',
    icon: AlertTriangle,
  },
  danger: {
    border: 'border-l-paper-coral',
    bg: 'bg-paper-coral/5',
    text: 'text-paper-coral',
    icon: ShieldAlert,
  },
  quote: {
    border: 'border-l-purple-500',
    bg: 'bg-purple-500/5',
    text: 'text-purple-500',
    icon: Quote,
  },
  info: {
    border: 'border-l-cyan-500',
    bg: 'bg-cyan-500/5',
    text: 'text-cyan-500',
    icon: Sparkles,
  },
};

export const Callout: React.FC<CalloutProps> = ({ type = 'note', title, children }) => {
  const style = calloutStyles[type] || calloutStyles.note;
  const Icon = style.icon;

  return (
    <div
      className={`my-6 rounded-2xl border-l-4 ${style.border} ${style.bg} border-y border-r border-paper-border p-5`}
    >
      <div className="flex items-start gap-3.5">
        <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${style.text}`} />
        <div className="flex-1 space-y-1 text-sm leading-relaxed">
          {title && <h5 className={`font-semibold tracking-tight font-sans ${style.text}`}>{title}</h5>}
          <div className="text-paper-ink [&>p]:m-0">{children}</div>
        </div>
      </div>
    </div>
  );
};
