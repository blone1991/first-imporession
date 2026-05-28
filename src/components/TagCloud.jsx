function getTagStyle(count) {
  if (count >= 10) return { size: 'text-2xl', weight: 'font-black', bg: 'bg-purple-600 text-white', scale: 'scale-110' };
  if (count >= 7)  return { size: 'text-xl',  weight: 'font-extrabold', bg: 'bg-purple-500 text-white', scale: '' };
  if (count >= 5)  return { size: 'text-lg',  weight: 'font-bold',      bg: 'bg-purple-400 text-white', scale: '' };
  if (count >= 3)  return { size: 'text-base', weight: 'font-semibold',  bg: 'bg-purple-200 text-purple-900', scale: '' };
  if (count >= 2)  return { size: 'text-sm',  weight: 'font-medium',    bg: 'bg-purple-100 text-purple-700', scale: '' };
  return           { size: 'text-xs',  weight: 'font-normal',    bg: 'bg-gray-100 text-gray-600', scale: '' };
}

export default function TagCloud({ impressions }) {
  const counts = impressions.reduce((acc, imp) => {
    acc[imp.tagText] = (acc[imp.tagText] || 0) + 1;
    return acc;
  }, {});

  const sorted = Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);

  if (sorted.length === 0) {
    return (
      <p className="text-center text-gray-400 text-sm py-8">
        아직 받은 첫인상이 없어요
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center p-2">
      {sorted.map(({ tag, count }) => {
        const style = getTagStyle(count);
        return (
          <div
            key={tag}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
              transition-transform duration-200
              ${style.size} ${style.weight} ${style.bg} ${style.scale}
            `}
          >
            <span>{tag}</span>
            {count > 1 && (
              <span className="opacity-70 text-xs">×{count}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
