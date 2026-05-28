import { useState } from 'react';
import { X } from 'lucide-react';

export default function AddMemberModal({ onAdd, onClose }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setLoading(true);
    await onAdd(trimmed);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-bounce-in">
        <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-5 flex items-center justify-between">
          <div>
            <p className="font-black text-white text-lg">🌟 첫인상 받아보기</p>
            <p className="text-purple-100 text-xs mt-0.5">이름을 등록하면 카드가 생성돼요</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="text-center text-3xl py-2">🐾</div>
          <p className="text-center text-sm text-gray-500 -mt-2">
            이름을 입력하면 귀여운 아바타 카드가 생성되고<br />
            다른 분들이 첫인상 태그를 남겨줄 거예요!
          </p>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="이름 입력 (예: 홍길동)"
            autoFocus
            maxLength={10}
            className="bg-gray-50 rounded-2xl px-4 py-3 text-sm outline-none border-2 border-transparent focus:border-purple-200 transition-colors text-center font-semibold"
          />

          <button
            onClick={handleSubmit}
            disabled={!name.trim() || loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-3 rounded-2xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg"
          >
            {loading ? '생성 중...' : '내 카드 만들기 ✨'}
          </button>
        </div>
      </div>
    </div>
  );
}
