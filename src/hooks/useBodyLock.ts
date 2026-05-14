import { useEffect, useRef } from 'react';

export function useBodyLock(isLocked: boolean) {
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isLocked) {
      // Save current scroll position
      scrollYRef.current = window.scrollY;

      // Use padding-top approach - add padding equal to scroll height to prevent jump
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'relative';
    } else {
      // Restore styles
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
      document.body.style.position = '';

      // Restore scroll position
      window.scrollTo(0, scrollYRef.current);
    }

    return () => {
      // Cleanup
      document.body.style.paddingRight = '';
      document.body.style.overflow = '';
      document.body.style.position = '';
    };
  }, [isLocked]);
}
