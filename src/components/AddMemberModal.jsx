import { useState } from 'react';
import { X } from 'lucide-react';
import { generateRandomAvatar } from '../utils/avatar';

export default function AddMemberModal({ onAdd, onClose }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(() => generateRandomAvatar());

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setLoading(true);
    await onAdd(trimmed, avatar);
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
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-md transition-all duration-300"
              style={{ backgroundColor: avatar.bgColor }}
            >
              {avatar.emoji}
            </div>
            <button
              onClick={() => setAvatar(generateRandomAvatar())}
              className="text-xs text-purple-400 hover:text-purple-600 font-semibold transition-colors"
            >
              🎲 다시 뽑기
            </button>
          </div>

          <p className="text-center text-sm text-gray-400 -mt-1">
            이 아바타로 카드가 만들어져요
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
