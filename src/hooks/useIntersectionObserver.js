import { useEffect, useState } from 'react';

export const useIntersectionObserver = (
  elementRef,
  {
    root = null,
    rootMargin = '150px 0px',
    threshold = 0.1,
    once = true,
  } = {}
) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = elementRef?.current;
    if (!node || (once && isVisible)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [elementRef, isVisible, once, root, rootMargin, threshold]);

  return isVisible;
};

export default useIntersectionObserver;

