import { useEffect, useRef, useState } from 'react';

export default function usePreviewScale(footprint) {
  const containerRef = useRef(null);
  const [availableSize, setAvailableSize] = useState(Infinity);

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(([entry]) => {
      setAvailableSize(Math.min(entry.contentRect.width, entry.contentRect.height));
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const scale = Math.max(0.01, Math.min(1, availableSize / footprint));
  return { containerRef, scale };
}
