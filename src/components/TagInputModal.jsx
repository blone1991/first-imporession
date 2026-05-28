import { useState } from 'react';
import { X } from 'lucide-react';

const SUGGESTED_TAGS = [
  '#분위기메이커', '#첫인상_차도녀', '#미소천사', '#알고보면_개그맨',
  '#믿음직한', '#수줍은_첫인상', '#활발해보여', '#지적인_분위기',
  '#패션감각짱', '#친근한_느낌', '#카리스마있는', '#따뜻한_사람',
  '#유머감각good', '#진지해보여', '#에너지넘쳐', '#차분한_느낌',
  '#눈빛이_강렬해', '#귀여운_분위기', '#어른스러워', '#신비로운_느낌',
];

const MAX_SELECT = 5;

export default function TagInputModal({ target, onSubmit, onClose }) {
  const [selected, setSelected] = useState(new Set());
  const [custom, setCustom] = useState('');

  const toggleTag = (tag) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else if (next.size < MAX_SELECT) {
        next.add(tag);
      }
      return next;
    });
  };

  const handleAddCustom = () => {
    const trimmed = custom.trim();
    if (!trimmed) return;
    const tag = trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
    if (selected.size < MAX_SELECT) {
      setSelected((prev) => new Set([...prev, tag]));
    }
    setCustom('');
  };

  const handleSubmit = () => {
    if (selected.size === 0) return;
    onSubmit(target.id, [...selected]);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-bounce-in">
        <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-xl shadow"
              style={{ backgroundColor: target.bgColor }}
            >
              {target.emoji}
            </div>
            <div>
              <p className="font-black text-white text-base">{target.name}</p>
              <p className="text-purple-100 text-xs">첫인상이 어떠셨나요?</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap gap-2 mb-4">
            {SUGGESTED_TAGS.map((tag) => {
              const isOn = selected.has(tag);
              const disabled = !isOn && selected.size >= MAX_SELECT;
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  disabled={disabled}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 border-2 ${
                    isOn
                      ? 'bg-purple-500 border-purple-500 text-white scale-105 shadow-md'
                      : disabled
                      ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed'
                      : 'bg-purple-50 border-purple-100 text-purple-600 hover:border-purple-300 hover:scale-105'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
              placeholder="직접 입력... (#태그)"
              className="flex-1 bg-gray-50 rounded-2xl px-4 py-2 text-sm outline-none border-2 border-transparent focus:border-purple-200 transition-colors"
            />
            <button
              onClick={handleAddCustom}
              disabled={!custom.trim() || selected.size >= MAX_SELECT}
              className="bg-purple-100 text-purple-600 font-bold text-sm px-4 py-2 rounded-2xl hover:bg-purple-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              추가
            </button>
          </div>

          {selected.size > 0 && (
            <div className="bg-purple-50 rounded-2xl p-3 mb-4">
              <p className="text-xs text-purple-400 mb-2 font-semibold">선택한 태그 ({selected.size}/{MAX_SELECT})</p>
              <div className="flex flex-wrap gap-1.5">
                {[...selected].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full hover:bg-purple-600 transition-colors"
                  >
                    {tag} ×
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={selected.size === 0}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-3 rounded-2xl text-base hover:from-purple-600 hover:to-pink-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 shadow-lg"
          >
            {selected.size === 0 ? '태그를 선택해주세요' : `💬 첫인상 남기기 (${selected.size}개)`}
          </button>
        </div>
      </div>
    </div>
  );
}
