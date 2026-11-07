import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'inset' | 'outline' | 'flat' | 'interactive';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className,
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-200';

  const variants = {
    default:
      'bg-white dark:bg-slate-900 border border-[#E3E7ED] dark:border-slate-800 shadow-[0_4px_20px_rgba(32,43,60,0.06),0_1px_3px_rgba(32,43,60,0.04)] text-[#202B3C] dark:text-slate-100',
    elevated:
      'bg-white dark:bg-slate-900 border border-[#E3E7ED] dark:border-slate-800 shadow-[0_10px_28px_rgba(32,43,60,0.08),0_2px_6px_rgba(32,43,60,0.04)] text-[#202B3C] dark:text-slate-100',
    inset:
      'bg-[#F0F2F5] dark:bg-slate-950/60 border border-[#E3E7ED] dark:border-slate-800 shadow-[inset_0_2px_4px_rgba(32,43,60,0.05)] text-[#202B3C] dark:text-slate-100',
    outline:
      'bg-transparent border border-[#E3E7ED] dark:border-slate-800 text-[#202B3C] dark:text-slate-100',
    flat:
      'bg-[#F0F2F5] dark:bg-slate-900/50 border border-[#E3E7ED] dark:border-slate-800 text-[#202B3C] dark:text-slate-100',
    interactive:
      'bg-white dark:bg-slate-900 border border-[#E3E7ED] dark:border-slate-800 shadow-[0_4px_20px_rgba(32,43,60,0.06),0_1px_3px_rgba(32,43,60,0.04)] hover:shadow-[0_12px_30px_rgba(32,43,60,0.09),0_3px_8px_rgba(32,43,60,0.04)] hover:-translate-y-0.5 hover:border-[#CBD5E1] cursor-pointer text-[#202B3C] dark:text-slate-100',
  };

  return (
    <div className={twMerge(clsx(baseStyles, variants[variant], className))} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={twMerge(clsx('p-5 pb-3 flex flex-col space-y-1.5', className))} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => (
  <h3 className={twMerge(clsx('text-base font-bold text-[#202B3C] dark:text-slate-100 tracking-tight', className))} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className,
  ...props
}) => (
  <p className={twMerge(clsx('text-xs text-[#647184] dark:text-slate-400 leading-normal', className))} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={twMerge(clsx('p-5 pt-2', className))} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div className={twMerge(clsx('p-5 pt-0 flex items-center', className))} {...props}>
    {children}
  </div>
);
