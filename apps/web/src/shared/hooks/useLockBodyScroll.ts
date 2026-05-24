import { useEffect } from 'react';

let lockCount = 0;

function lockScroll() {
  lockCount += 1;

  if (lockCount === 1) {
    document.documentElement.classList.add('modal-scroll-lock');
    document.body.classList.add('modal-scroll-lock');
  }
}

function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);

  if (lockCount === 0) {
    document.documentElement.classList.remove('modal-scroll-lock');
    document.body.classList.remove('modal-scroll-lock');
  }
}

/** Prevents background page scroll while a modal is open. Supports nested modals. */
export function useLockBodyScroll(active = true) {
  useEffect(() => {
    if (!active) {
      return undefined;
    }

    lockScroll();

    return () => {
      unlockScroll();
    };
  }, [active]);
}
