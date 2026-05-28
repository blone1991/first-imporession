import { useState } from 'react';
import { UserPlus } from 'lucide-react';

export default function WhoAreYouModal({ members, onSelect, onAddMember, isDemo }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setLoading(true);
    const newMember = await onAddMember(trimmed);
    onSelect(newMember);
  };

  if (members.length === 0) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-spin">✨</div>
          <p className="text-gray-400 text-sm">연결 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full">
        {isDemo && (
          <div className="text-center text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-1.5 mb-4">
            🎮 데모 모드 — 데이터는 이 기기에만 저장됩니다
          </div>
        )}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">👋</div>
          <h2 className="text-2xl font-black text-gray-800">안녕하세요!</h2>
          <p className="text-gray-400 text-sm mt-1">어떤 분이세요?</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {members.map((member) => (
            <button
              key={member.id}
              onClick={() => onSelect(member)}
              className="flex flex-col items-center p-4 rounded-2xl border-2 border-transparent hover:border-purple-200 hover:bg-purple-50 active:scale-95 transition-all duration-150"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-2 shadow-sm"
                style={{ backgroundColor: member.bgColor }}
              >
                {member.emoji}
              </div>
              <span className="text-sm font-bold text-gray-700">{member.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 pt-5 border-t border-gray-100">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-purple-200 text-purple-400 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all duration-150 font-semibold text-sm"
            >
              <UserPlus size={16} />
              나도 참여하기
            </button>
          ) : (
            <div className="flex flex-col gap-2 animate-bounce-in">
              <p className="text-xs text-gray-400 text-center font-medium">이름을 입력해주세요</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                  placeholder="홍길동"
                  autoFocus
                  maxLength={10}
                  className="flex-1 bg-gray-50 rounded-2xl px-4 py-2.5 text-sm outline-none border-2 border-transparent focus:border-purple-200 transition-colors"
                />
                <button
                  onClick={handleAdd}
                  disabled={!name.trim() || loading}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm px-4 py-2.5 rounded-2xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                >
                  {loading ? '...' : '추가'}
                </button>
              </div>
              <button
                onClick={() => { setShowForm(false); setName(''); }}
                className="text-xs text-gray-400 hover:text-gray-600 text-center transition-colors"
              >
                취소
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
