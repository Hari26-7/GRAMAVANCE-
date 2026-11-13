import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { lockBodyScroll, unlockBodyScroll } from '../../utils/scrollLock';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
  showCloseButton = true,
}) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const mouseDownTargetRef = useRef<EventTarget | null>(null);

  // Bulletproof body scroll locking & keyboard escape listener
  useEffect(() => {
    if (!isOpen) return;

    lockBodyScroll();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      unlockBodyScroll();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl',
  };

  // Only close if mousedown and click both occurred on the backdrop itself (prevents accidental closing on text drag)
  const handleBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseDownTargetRef.current = e.target;
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      mouseDownTargetRef.current === backdropRef.current &&
      e.target === backdropRef.current
    ) {
      onClose();
    }
    mouseDownTargetRef.current = null;
  };

  return (
    <div
      ref={backdropRef}
      onMouseDown={handleBackdropMouseDown}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-xs overscroll-contain transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
    >
      {/* Outer flex container ensuring vertical alignment and scrollability */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-5 text-center">
        <div
          className={twMerge(
            clsx(
              'w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100vh-3.5rem)] my-auto text-left transition-all duration-200 animate-in fade-in zoom-in-95',
              sizeClasses[size],
              className
            )
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header (shrink-0 prevents squishing on small viewports) */}
          {(title || showCloseButton) && (
            <div className="flex items-start justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-white/95 dark:bg-slate-900/95 sticky top-0 z-10">
              <div className="pr-4">
                {title && (
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>

              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label="Close dialog (Escape)"
                  title="Close dialog (Escape)"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 overscroll-contain leading-relaxed">
            {children}
          </div>

          {/* Optional Pinned Footer */}
          {footer && (
            <div className="p-3.5 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 shrink-0 flex items-center justify-end gap-2.5">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
