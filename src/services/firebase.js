import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  doc, 
  setDoc
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "AIzaSyMockKeyForKalaKritiApp123456789",
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "kalakriti-app.firebaseapp.com",
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "kalakriti-app",
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "kalakriti-app.appspot.com",
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

// Initialize Firebase App instance safely
let app;
let db = null;
let storage = null;
let auth = null;
let isFirebaseConnected = false;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  // Only connect if real project ID provided or default placeholder
  if (import.meta.env?.VITE_FIREBASE_PROJECT_ID) {
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
    isFirebaseConnected = true;
  }
} catch (err) {
  console.warn('[KalaKriti] Firebase initialized in local fallback mode:', err.message);
  isFirebaseConnected = false;
}

export { db, storage, auth, isFirebaseConnected };

// Real-time synchronization helper (cross-device/tab Firestore listener with fallback)
export const subscribeToRealtimeCollection = (collectionName, onDataChange) => {
  if (isFirebaseConnected && db) {
    try {
      const colRef = collection(db, collectionName);
      return onSnapshot(colRef, (snapshot) => {
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        if (docs.length > 0) {
          onDataChange(docs);
        }
      }, (err) => {
        console.warn(`[KalaKriti] Firestore subscription warning for ${collectionName}:`, err.message);
      });
    } catch (e) {
      console.warn(`[KalaKriti] Failed to subscribe to Firestore collection ${collectionName}:`, e.message);
    }
  }

  // Cross-tab BroadcastChannel sync fallback for browsers
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    const channel = new BroadcastChannel(`kalakriti_${collectionName}_channel`);
    channel.onmessage = (event) => {
      if (event.data?.docs) {
        onDataChange(event.data.docs);
      }
    };
  }

  return () => {};
};

// Broadcast local state updates across browser tabs/devices
export const broadcastDataUpdate = (collectionName, docs) => {
  if (isFirebaseConnected && db) {
    try {
      docs.forEach(async (item) => {
        if (item.id) {
          const docRef = doc(db, collectionName, String(item.id));
          await setDoc(docRef, item, { merge: true });
        }
      });
    } catch (err) {
      console.warn(`[KalaKriti] Failed sync to Firestore collection ${collectionName}:`, err.message);
    }
  }

  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      const channel = new BroadcastChannel(`kalakriti_${collectionName}_channel`);
      channel.postMessage({ docs });
    } catch {
      // ignore
    }
  }
};
