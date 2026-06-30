import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD2fC8yYeDtVHdgf0mczRxaXTk_vcVtjrY",
  authDomain: "mi-cibungur-i.firebaseapp.com",
  projectId: "mi-cibungur-i",
  storageBucket: "mi-cibungur-i.firebasestorage.app",
  messagingSenderId: "222228221747",
  appId: "1:222228221747:web:a1adcf947779034367b846",
  measurementId: "G-DZPEC9YRJ7"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// Enable offline persistence if possible
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firebase persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Firebase persistence is not supported in this browser');
    }
  });
} catch (e) {
  console.error('Error enabling persistence:', e);
}

export { app, db, auth };
