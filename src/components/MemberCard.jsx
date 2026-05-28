import { forwardRef } from 'react';

const MemberCard = forwardRef(function MemberCard({ member, impressionCount, onClick }, ref) {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-lg p-5 flex flex-col items-center gap-3 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border-2 border-transparent hover:border-purple-100"
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-sm transition-transform duration-200 group-hover:scale-110"
        style={{ backgroundColor: member.bgColor }}
      >
        {member.emoji}
      </div>

      <div className="text-center">
        <p className="font-bold text-gray-800 text-sm">{member.name}</p>
        {impressionCount > 0 ? (
          <p className="text-xs text-purple-400 mt-0.5 font-medium">태그 {impressionCount}개 →</p>
        ) : (
          <p className="text-xs text-gray-300 mt-0.5">첫인상 남기기</p>
        )}
      </div>
    </button>
  );
});

export default MemberCard;
