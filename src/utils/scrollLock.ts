/**
 * Bulletproof Body Scroll Lock Utility for Gramavance AI
 *
 * Prevents background page scrolling while modals/dialogs are active,
 * avoids layout shifts, and restores the EXACT user scroll position upon closing.
 */

let activeModals = 0;
let savedScrollY = 0;
let previousBodyOverflow = '';
let previousHtmlOverflow = '';
let previousBodyPaddingRight = '';

export function lockBodyScroll(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  if (activeModals === 0) {
    // Record original scroll position
    savedScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

    // Cache original styles
    previousBodyOverflow = document.body.style.overflow;
    previousHtmlOverflow = document.documentElement.style.overflow;
    previousBodyPaddingRight = document.body.style.paddingRight;

    // Calculate scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // Apply scroll lock
    document.body.style.overflow = 'hidden';
  }
  activeModals++;
}

export function unlockBodyScroll(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  activeModals = Math.max(0, activeModals - 1);

  if (activeModals === 0) {
    // Restore overflow completely by removing inline style override
    document.body.style.overflow = previousBodyOverflow || '';
    document.documentElement.style.overflow = previousHtmlOverflow || '';
    document.body.style.paddingRight = previousBodyPaddingRight || '';

    // Restore exact scroll position
    window.scrollTo({
      top: savedScrollY,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });
  }
}

/**
 * Force clean reset if component unmounts unexpectedly
 */
export function forceUnlockAllScroll(): void {
  activeModals = 0;
  if (typeof document !== 'undefined') {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.style.paddingRight = '';
  }
}

