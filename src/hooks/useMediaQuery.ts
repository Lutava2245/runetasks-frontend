import { useState, useEffect } from 'react';

export function useIsLargeScreen() {
  const [isLarge, setIsLarge] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const updateTarget = (e: MediaQueryListEvent | MediaQueryList) => setIsLarge(e.matches);

    updateTarget(media);
    media.addEventListener('change', updateTarget);
    return () => media.removeEventListener('change', updateTarget);
  }, []);

  return isLarge;
}