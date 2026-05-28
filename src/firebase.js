import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, v]) => !v || v.includes('your_'))
  .map(([k]) => k);

if (missingKeys.length > 0) {
  console.warn('[Firebase] 누락된 환경변수:', missingKeys);
}

export const isFirebaseConfigured = missingKeys.length === 0;

let db = null;

if (isFirebaseConfigured) {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
}

export { db };
