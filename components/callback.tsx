import { cn } from '@/lib/cn';
import {
  CircleCheck,
  CircleX,
  Info,
  Lightbulb,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';

type CallbackType =
  | 'tip'
  | 'note'
  | 'info'
  | 'warn'
  | 'warning'
  | 'danger'
  | 'error'
  | 'success';

interface CallbackProps extends Omit<ComponentProps<'div'>, 'title'> {
  type?: CallbackType;
  title?: ReactNode;
  icon?: ReactNode;
}

const colorMap: Record<CallbackType, string> = {
  tip: '#f5b301',
  note: '#5b8def',
  info: '#5b8def',
  warn: '#f97316',
  warning: '#f97316',
  danger: '#ef4444',
  error: '#ef4444',
  success: '#22c55e',
};

const iconMap: Record<CallbackType, LucideIcon> = {
  tip: Lightbulb,
  note: Info,
  info: Info,
  warn: TriangleAlert,
  warning: TriangleAlert,
  danger: CircleX,
  error: CircleX,
  success: CircleCheck,
};

const typeAlias: Record<CallbackType, CallbackType> = {
  warn: 'warning',
  error: 'danger',
  tip: 'tip',
  note: 'note',
  info: 'info',
  warning: 'warning',
  danger: 'danger',
  success: 'success',
};

export function Callback({
  type = 'tip',
  title,
  icon,
  className,
  children,
  style,
  ...props
}: CallbackProps) {
  const resolved = typeAlias[type] ?? 'tip';
  const Icon = icon ? undefined : (iconMap[resolved] ?? Info);
  const color = colorMap[resolved];

  return (
    <div
      className={cn('my-4 rounded-lg border p-4 text-sm shadow-sm', className)}
      style={{
        borderColor: `color-mix(in oklab, ${color} 45%, transparent)`,
        backgroundColor: `color-mix(in oklab, ${color} 10%, transparent)`,
        ...style,
      }}
      {...props}
    >
      {title && (
        <p
          className="mb-2 flex items-center gap-1.5 font-medium"
          style={{ color }}
        >
          {Icon && <Icon className="size-4 shrink-0" />}
          {title}
        </p>
      )}
      <div className="text-fd-muted-foreground prose-no-margin">{children}</div>
    </div>
  );
}
