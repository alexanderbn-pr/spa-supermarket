import { useEffect, useCallback } from 'react';

export function useBodyLock(isLocked: boolean) {
  const lock = useCallback(() => {
    if (typeof document !== 'undefined') {
      // Use inline styles for reliability
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
    }
  }, []);

  const unlock = useCallback(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
    }
  }, []);

  useEffect(() => {
    if (isLocked) {
      lock();
    } else {
      unlock();
    }

    return () => {
      unlock();
    };
  }, [isLocked, lock, unlock]);
}
