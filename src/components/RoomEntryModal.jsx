import { useState } from 'react';

function generateRoomCode() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default function RoomEntryModal({ onEnter }) {
  const [code, setCode] = useState('');
  const [newCode] = useState(() => generateRoomCode());
  const [tab, setTab] = useState('join'); // 'join' | 'create'

  const handleJoin = () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 1) return;
    onEnter(trimmed);
  };

  const handleCreate = () => {
    onEnter(newCode);
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">✨</div>
          <h2 className="text-2xl font-black text-gray-800">첫인상 타임</h2>
          <p className="text-gray-400 text-sm mt-1">방 코드로 모임을 구분해요</p>
        </div>

        <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
          <button
            onClick={() => setTab('join')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
              tab === 'join' ? 'bg-white shadow text-purple-600' : 'text-gray-400'
            }`}
          >
            방 입장
          </button>
          <button
            onClick={() => setTab('create')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
              tab === 'create' ? 'bg-white shadow text-purple-600' : 'text-gray-400'
            }`}
          >
            새 방 만들기
          </button>
        </div>

        {tab === 'join' ? (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              placeholder="방 코드 입력 (예: HELLO1)"
              maxLength={10}
              autoFocus
              className="bg-gray-50 rounded-2xl px-4 py-3 text-sm outline-none border-2 border-transparent focus:border-purple-200 transition-colors text-center font-bold tracking-widest uppercase"
            />
            <button
              onClick={handleJoin}
              disabled={!code.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-3 rounded-2xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg"
            >
              입장하기 →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="bg-purple-50 rounded-2xl p-4 text-center">
              <p className="text-xs text-purple-400 mb-1">생성될 방 코드</p>
              <p className="text-2xl font-black text-purple-600 tracking-widest">{newCode}</p>
              <p className="text-xs text-gray-400 mt-1">이 코드를 모임원들과 공유하세요</p>
            </div>
            <button
              onClick={handleCreate}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-3 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all active:scale-95 shadow-lg"
            >
              이 코드로 방 만들기 ✨
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
