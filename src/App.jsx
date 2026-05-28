import { useState, useEffect, useRef } from 'react';
import { ref, onValue, push, set, get } from 'firebase/database';
import { db, isFirebaseConfigured } from './firebase';
import { generateAvatar } from './utils/avatar';
import MemberCard from './components/MemberCard';
import TagInputModal from './components/TagInputModal';
import FlyingTagAnimation from './components/FlyingTagAnimation';
import MemberDetailModal from './components/MemberDetailModal';
import AddMemberModal from './components/AddMemberModal';

const SAMPLE_MEMBERS = [
  { id: 'user1', name: '김민준' },
  { id: 'user2', name: '이서연' },
  { id: 'user3', name: '박지호' },
  { id: 'user4', name: '최수아' },
  { id: 'user5', name: '정태양' },
  { id: 'user6', name: '한가을' },
];

function useDemoState() {
  const [members, setMembers] = useState(() =>
    SAMPLE_MEMBERS.map((m) => ({ ...m, ...generateAvatar(m.id) }))
  );
  const [impressions, setImpressions] = useState([]);

  const addImpressions = (targetUserId, tags) => {
    setImpressions((prev) => [
      ...prev,
      ...tags.map((tag) => ({
        id: `${Date.now()}_${Math.random()}`,
        targetUserId,
        tagText: tag,
        timestamp: Date.now(),
      })),
    ]);
  };

  const addMember = (name) => {
    const id = `user_${Date.now()}`;
    const newMember = { id, name, ...generateAvatar(id) };
    setMembers((prev) => [...prev, newMember]);
    return newMember;
  };

  return { members, impressions, addImpressions, addMember };
}

function useFirebaseState() {
  const [members, setMembers] = useState([]);
  const [impressions, setImpressions] = useState([]);

  useEffect(() => {
    const membersRef = ref(db, 'users');
    get(membersRef).then((snapshot) => {
      if (!snapshot.exists()) {
        const initial = {};
        SAMPLE_MEMBERS.forEach((m) => {
          initial[m.id] = { ...m, ...generateAvatar(m.id) };
        });
        set(membersRef, initial);
      }
    });
    return onValue(membersRef, (snapshot) => {
      if (snapshot.exists()) setMembers(Object.values(snapshot.val()));
    });
  }, []);

  useEffect(() => {
    return onValue(ref(db, 'impressions'), (snapshot) => {
      setImpressions(snapshot.exists() ? Object.values(snapshot.val()) : []);
    });
  }, []);

  const addImpressions = async (targetUserId, tags) => {
    const impressionsRef = ref(db, 'impressions');
    for (const tag of tags) {
      await push(impressionsRef, { targetUserId, tagText: tag, timestamp: Date.now() });
    }
  };

  const addMember = async (name) => {
    const id = `user_${Date.now()}`;
    const newMember = { id, name, ...generateAvatar(id) };
    await set(ref(db, `users/${id}`), newMember);
    return newMember;
  };

  return { members, impressions, addImpressions, addMember };
}

export default function App() {
  const { members, impressions, addImpressions, addMember } = isFirebaseConfigured
    ? useFirebaseState()
    : useDemoState();

  const [detailTarget, setDetailTarget] = useState(null);
  const [tagTarget, setTagTarget] = useState(null);
  const [flyingTag, setFlyingTag] = useState(null);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const cardRefs = useRef({});

  const handleTagSubmit = async (targetUserId, tags) => {
    setTagTarget(null);
    const targetRect = cardRefs.current[targetUserId]?.getBoundingClientRect() ?? null;
    setFlyingTag({ tags, targetRect });
    await addImpressions(targetUserId, tags);
  };

  const handleAddMember = async (name) => {
    await addMember(name);
    setAddMemberOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {!isFirebaseConfigured && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 text-center text-sm text-amber-700">
          🎮 데모 모드 (Firebase 미연결) — .env 파일을 설정하면 실시간 공유가 활성화됩니다
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
            ✨ 첫인상 타임
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            카드를 눌러 첫인상을 확인하거나 익명으로 남겨보세요
          </p>
          <button
            onClick={() => setAddMemberOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-5 py-2.5 rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 active:scale-95 transition-all text-sm"
          >
            🌟 첫인상 받아보기
          </button>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              ref={(el) => (cardRefs.current[member.id] = el)}
              member={member}
              impressionCount={impressions.filter((i) => i.targetUserId === member.id).length}
              onClick={() => setDetailTarget(member)}
            />
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          모든 첫인상은 익명으로 전달됩니다
        </p>
      </div>

      {detailTarget && (
        <MemberDetailModal
          member={detailTarget}
          impressions={impressions.filter((i) => i.targetUserId === detailTarget.id)}
          onTagClick={() => setTagTarget(detailTarget)}
          onClose={() => setDetailTarget(null)}
        />
      )}

      {tagTarget && (
        <TagInputModal
          target={tagTarget}
          onSubmit={handleTagSubmit}
          onClose={() => setTagTarget(null)}
        />
      )}

      {addMemberOpen && (
        <AddMemberModal
          onAdd={handleAddMember}
          onClose={() => setAddMemberOpen(false)}
        />
      )}

      {flyingTag && (
        <FlyingTagAnimation
          tags={flyingTag.tags}
          targetRect={flyingTag.targetRect}
          onComplete={() => setFlyingTag(null)}
        />
      )}
    </div>
  );
}
