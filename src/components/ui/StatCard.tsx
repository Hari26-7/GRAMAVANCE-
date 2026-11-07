import React from 'react';
import { Card } from './Card';
import { clsx } from 'clsx';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  badgeText?: string;
  badgeVariant?: 'teal' | 'success' | 'warning' | 'info' | 'neutral';
  accentColor?: 'teal' | 'navy' | 'amber' | 'emerald' | 'blue';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  badgeText,
  badgeVariant = 'teal',
  accentColor = 'teal',
  onClick,
}) => {
  const iconColors = {
    teal: 'bg-teal-50 text-teal-600 dark:bg-teal-950/70 dark:text-teal-400 border border-teal-200/50 dark:border-teal-800/50',
    navy: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-950/70 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50',
  };

  const badgeColors = {
    teal: 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  };

  return (
    <Card
      variant={onClick ? 'interactive' : 'default'}
      onClick={onClick}
      className="p-5 relative overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {value}
            </h4>
            {badgeText && (
              <span className={clsx('text-[11px] font-medium px-2 py-0.5 rounded-full', badgeColors[badgeVariant])}>
                {badgeText}
              </span>
            )}
          </div>
        </div>
        <div className={clsx('p-2.5 rounded-xl shrink-0', iconColors[accentColor])}>
          {icon}
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/70 flex items-center justify-between text-xs">
          {subtitle && (
            <span className="text-slate-500 dark:text-slate-400 truncate max-w-[70%]">
              {subtitle}
            </span>
          )}
          {trend && (
            <span
              className={clsx(
                'font-medium inline-flex items-center gap-1 shrink-0 ml-auto',
                trend.positive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              )}
            >
              {trend.positive ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
