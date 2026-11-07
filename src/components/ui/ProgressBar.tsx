import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showPercent?: boolean;
  color?: 'teal' | 'navy' | 'emerald' | 'amber' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercent = true,
  color = 'teal',
  size = 'md',
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const barColors = {
    teal: 'bg-teal-500',
    navy: 'bg-slate-800 dark:bg-slate-300',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    blue: 'bg-blue-500',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={twMerge('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
          {label && <span>{label}</span>}
          {showPercent && <span className="tabular-nums font-semibold">{percentage}%</span>}
        </div>
      )}
      <div className={twMerge('w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden', sizes[size])}>
        <div
          className={clsx('h-full rounded-full transition-all duration-500 ease-out', barColors[color])}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};
