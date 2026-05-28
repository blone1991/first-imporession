import { X, MessageCirclePlus } from 'lucide-react';
import TagCloud from './TagCloud';

export default function MemberDetailModal({ member, impressions, onTagClick, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md flex flex-col animate-bounce-in" style={{ maxHeight: '90vh' }}>
        <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-5 flex items-center justify-between flex-shrink-0 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-xl shadow"
              style={{ backgroundColor: member.bgColor }}
            >
              {member.emoji}
            </div>
            <div>
              <p className="font-black text-white text-base">{member.name}님의 첫인상</p>
              <p className="text-purple-100 text-xs">
                {impressions.length > 0 ? `총 ${impressions.length}개의 태그` : '아직 태그 없음'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {impressions.length > 0 ? (
            <>
              <p className="text-center text-xs text-gray-400 mb-4">
                많이 받은 태그일수록 크게 보여요 ✨
              </p>
              <TagCloud impressions={impressions} />
            </>
          ) : (
            <p className="text-center text-gray-400 text-sm py-6">
              아직 받은 첫인상 태그가 없어요<br />
              <span className="text-xs text-gray-300">첫 번째로 남겨보세요!</span>
            </p>
          )}
        </div>

        <div className="p-4 pt-0 flex-shrink-0">
          <button
            onClick={onTagClick}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-2xl hover:from-purple-600 hover:to-pink-600 active:scale-95 transition-all shadow-md text-sm"
          >
            <MessageCirclePlus size={16} />
            익명으로 첫인상 남기기
          </button>
        </div>
      </div>
    </div>
  );
}
