import { useState, useEffect, useRef } from 'react';
import { ref, onValue, push, set, get } from 'firebase/database';
import { db, isFirebaseConfigured } from './firebase';
import { generateAvatar } from './utils/avatar';
import MemberCard from './components/MemberCard';
import TagInputModal from './components/TagInputModal';
import FlyingTagAnimation from './components/FlyingTagAnimation';
import MemberDetailModal from './components/MemberDetailModal';
import AddMemberModal from './components/AddMemberModal';
import RoomEntryModal from './components/RoomEntryModal';

const SAMPLE_MEMBERS = [
  { id: 'user1', name: '김민준' },
  { id: 'user2', name: '이서연' },
  { id: 'user3', name: '박지호' },
  { id: 'user4', name: '최수아' },
  { id: 'user5', name: '정태양' },
  { id: 'user6', name: '한가을' },
];

const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function makeCode() {
  return Array.from({ length: 6 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');
}

function getRoomCodeFromURL() {
  return new URLSearchParams(window.location.search).get('room');
}

function setRoomCodeInURL(code) {
  const url = new URL(window.location.href);
  if (code) url.searchParams.set('room', code);
  else url.searchParams.delete('room');
  window.history.pushState({}, '', url);
}

function useDemoState() {
  const [members, setMembers] = useState(() =>
    SAMPLE_MEMBERS.map((m) => ({ ...m, ...generateAvatar(m.id) }))
  );
  const [impressions, setImpressions] = useState([]);

  const addImpressions = (targetUserId, tags) => {
    setImpressions((prev) => [
      ...prev,
      ...tags.map((tag) => ({ id: `${Date.now()}_${Math.random()}`, targetUserId, tagText: tag, timestamp: Date.now() })),
    ]);
  };

  const addMember = (name, avatar) => {
    const id = `user_${Date.now()}`;
    const newMember = { id, name, ...avatar };
    setMembers((prev) => [...prev, newMember]);
    return newMember;
  };

  return { members, impressions, addImpressions, addMember };
}

function useFirebaseState(roomCode) {
  const [members, setMembers] = useState([]);
  const [impressions, setImpressions] = useState([]);

  useEffect(() => {
    if (!roomCode) return;
    return onValue(ref(db, `rooms/${roomCode}/users`), (snapshot) => {
      setMembers(snapshot.exists() ? Object.values(snapshot.val()) : []);
    });
  }, [roomCode]);

  useEffect(() => {
    if (!roomCode) return;
    return onValue(ref(db, `rooms/${roomCode}/impressions`), (snapshot) => {
      setImpressions(snapshot.exists() ? Object.values(snapshot.val()) : []);
    });
  }, [roomCode]);

  const addImpressions = async (targetUserId, tags) => {
    for (const tag of tags) {
      await push(ref(db, `rooms/${roomCode}/impressions`), { targetUserId, tagText: tag, timestamp: Date.now() });
    }
  };

  const addMember = async (name, avatar) => {
    const id = `user_${Date.now()}`;
    const newMember = { id, name, ...avatar };
    await set(ref(db, `rooms/${roomCode}/users/${id}`), newMember);
    return newMember;
  };

  return { members, impressions, addImpressions, addMember };
}

export default function App() {
  const [roomCode, setRoomCode] = useState(() => getRoomCodeFromURL() ?? localStorage.getItem('room_code'));
  const [copied, setCopied] = useState(false);

  const { members, impressions, addImpressions, addMember } = isFirebaseConfigured
    ? useFirebaseState(roomCode)
    : useDemoState();

  const [detailTarget, setDetailTarget] = useState(null);
  const [tagTarget, setTagTarget] = useState(null);
  const [flyingTag, setFlyingTag] = useState(null);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const cardRefs = useRef({});

  const enterRoom = (code) => {
    localStorage.setItem('room_code', code);
    setRoomCodeInURL(code);
    setRoomCode(code);
  };

  const handleJoin = async (code) => {
    if (isFirebaseConfigured) {
      const snap = await get(ref(db, `rooms/${code}`));
      if (!snap.exists()) return '존재하지 않는 방 코드예요';
    }
    enterRoom(code);
    return null;
  };

  const handleCreateRoom = async () => {
    let code = makeCode();
    if (isFirebaseConfigured) {
      // 중복 확인 (최대 5회 시도)
      for (let i = 0; i < 5; i++) {
        const snap = await get(ref(db, `rooms/${code}`));
        if (!snap.exists()) break;
        code = makeCode();
      }
    }
    enterRoom(code);
  };

  const handleLeaveRoom = () => {
    localStorage.removeItem('room_code');
    setRoomCodeInURL(null);
    setRoomCode(null);
    setDetailTarget(null);
    setTagTarget(null);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}?room=${roomCode}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTagSubmit = async (targetUserId, tags) => {
    setTagTarget(null);
    const targetRect = cardRefs.current[targetUserId]?.getBoundingClientRect() ?? null;
    setFlyingTag({ tags, targetRect });
    await addImpressions(targetUserId, tags);
  };

  const handleAddMember = async (name, avatar) => {
    await addMember(name, avatar);
    setAddMemberOpen(false);
  };

  if (isFirebaseConfigured && !roomCode) {
    return <RoomEntryModal onJoin={handleJoin} onCreateRoom={handleCreateRoom} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {!isFirebaseConfigured && (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 text-center text-sm text-amber-700">
          🎮 데모 모드 (Firebase 미연결)
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

          {roomCode && (
            <div className="inline-flex items-center gap-2 mt-3 bg-white rounded-full px-4 py-1.5 shadow-sm text-sm">
              <span className="text-gray-400 text-xs">방 코드</span>
              <span className="font-black text-purple-600 tracking-widest">{roomCode}</span>
              <button
                onClick={handleShare}
                className="text-xs font-semibold transition-colors px-2 py-0.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-500"
              >
                {copied ? '복사됨 ✓' : '공유'}
              </button>
              <span className="text-gray-200">|</span>
              <button
                onClick={handleLeaveRoom}
                className="text-gray-400 hover:text-red-400 text-xs transition-colors"
              >
                나가기
              </button>
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={() => setAddMemberOpen(true)}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-5 py-2.5 rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 active:scale-95 transition-all text-sm"
            >
              🌟 첫인상 받아보기
            </button>
          </div>
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

        {members.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">🐾</div>
            <p className="font-semibold">아직 아무도 없어요</p>
            <p className="text-sm mt-1">"첫인상 받아보기"로 카드를 만들어보세요</p>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">모든 첫인상은 익명으로 전달됩니다</p>
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
