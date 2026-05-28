import { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';

export default function FlyingTagAnimation({ tags, targetRect, onComplete }) {
  const tagRef = useRef(null);

  useEffect(() => {
    const el = tagRef.current;
    if (!el) return;

    let cancelled = false;

    const run = async () => {
      await animate(el, { scale: [0, 1.3, 1], opacity: [0, 1, 1] }, { duration: 0.35, ease: 'backOut' });
      if (cancelled) return;

      if (targetRect) {
        const elRect = el.getBoundingClientRect();
        const dx = targetRect.left + targetRect.width / 2 - (elRect.left + elRect.width / 2);
        const dy = targetRect.top + targetRect.height / 2 - (elRect.top + elRect.height / 2);

        await animate(
          el,
          { x: dx, y: dy, scale: 0.3, opacity: 0 },
          { duration: 0.55, ease: [0.4, 0, 1, 1] }
        );
      } else {
        await animate(el, { scale: 0, opacity: 0, y: -40 }, { duration: 0.35 });
      }

      if (!cancelled) onComplete();
    };

    run();
    return () => { cancelled = true; };
  }, []);

  const displayTag = tags[0];

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div
        ref={tagRef}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2.5 rounded-full text-lg font-black shadow-2xl"
        style={{ originX: '50%', originY: '50%' }}
      >
        {displayTag}
        {tags.length > 1 && (
          <span className="ml-1.5 text-sm text-purple-200 font-semibold">+{tags.length - 1}</span>
        )}
      </div>
    </div>
  );
}
