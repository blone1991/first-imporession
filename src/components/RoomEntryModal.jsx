import { useState } from 'react';

export default function RoomEntryModal({ onJoin, onCreateRoom }) {
  const [code, setCode] = useState('');
  const [creating, setCreating] = useState(false);

  const handleJoin = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    onJoin(trimmed);
  };

  const handleCreate = async () => {
    setCreating(true);
    await onCreateRoom();
    setCreating(false);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">✨</div>
          <h2 className="text-2xl font-black text-gray-800">첫인상 타임</h2>
          <p className="text-gray-400 text-sm mt-2">모임 코드로 입장하거나 새 방을 만드세요</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              placeholder="입장 코드 입력"
              autoFocus
              className="flex-1 bg-gray-50 rounded-2xl px-4 py-3 text-sm outline-none border-2 border-transparent focus:border-purple-200 transition-colors font-bold tracking-widest uppercase text-center"
            />
            <button
              onClick={handleJoin}
              disabled={!code.trim()}
              className="bg-purple-500 text-white font-bold px-5 py-3 rounded-2xl hover:bg-purple-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              입장
            </button>
          </div>

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-300">또는</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <button
            onClick={handleCreate}
            disabled={creating}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-3.5 rounded-2xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all active:scale-95 shadow-lg"
          >
            {creating ? '생성 중...' : '🎉 새 방 만들기'}
          </button>
        </div>
      </div>
    </div>
  );
}
