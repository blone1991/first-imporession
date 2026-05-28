// 기존 /users, /impressions 데이터를 /rooms/{roomCode}/ 하위로 이동
// 사용법: node scripts/migrate.js <방코드>
// 예시:  node scripts/migrate.js HELLO1

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, remove } from 'firebase/database';
import { readFileSync } from 'fs';

const roomCode = process.argv[2];
if (!roomCode) {
  console.error('❌ 방 코드를 입력하세요. 예: node scripts/migrate.js HELLO1');
  process.exit(1);
}

// .env 수동 파싱 (dotenv 없이)
const env = Object.fromEntries(
  readFileSync('.env', 'utf8')
    .split('\n')
    .filter(line => line.includes('=') && !line.startsWith('#'))
    .map(line => {
      const idx = line.indexOf('=');
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: env.VITE_FIREBASE_DATABASE_URL,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
});
const db = getDatabase(app);

async function migrate() {
  console.log(`\n🚀 마이그레이션 시작 → 방 코드: ${roomCode}\n`);

  const [usersSnap, impressionsSnap] = await Promise.all([
    get(ref(db, 'users')),
    get(ref(db, 'impressions')),
  ]);

  if (!usersSnap.exists() && !impressionsSnap.exists()) {
    console.log('ℹ️  마이그레이션할 기존 데이터가 없습니다.');
    process.exit(0);
  }

  if (usersSnap.exists()) {
    await set(ref(db, `rooms/${roomCode}/users`), usersSnap.val());
    console.log(`✅ users (${Object.keys(usersSnap.val()).length}명) → rooms/${roomCode}/users`);
  }

  if (impressionsSnap.exists()) {
    await set(ref(db, `rooms/${roomCode}/impressions`), impressionsSnap.val());
    console.log(`✅ impressions (${Object.keys(impressionsSnap.val()).length}개) → rooms/${roomCode}/impressions`);
  }

  await Promise.all([
    remove(ref(db, 'users')),
    remove(ref(db, 'impressions')),
  ]);
  console.log('🗑️  기존 경로 삭제 완료');
  console.log(`\n✨ 완료! 앱에서 방 코드 "${roomCode}" 로 입장하세요.\n`);
  process.exit(0);
}

migrate().catch(err => {
  console.error('❌ 마이그레이션 실패:', err.message);
  process.exit(1);
});
