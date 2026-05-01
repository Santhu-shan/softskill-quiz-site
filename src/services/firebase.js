// ============================================================
// Firebase Configuration (Ultra-Robust Version)
// ============================================================
import { initializeApp } from "firebase/app";
import { 
  initializeFirestore, 
  getFirestore,
  connectFirestoreEmulator
} from "firebase/firestore";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if config is placeholder or missing
const isConfigured = !!(firebaseConfig.apiKey && 
                       firebaseConfig.apiKey !== "your_api_key" && 
                       firebaseConfig.apiKey.length > 10);

let db;

if (isConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    
    // Simplest possible initialization with Long Polling forced
    // We remove the complex cache manager to avoid "Offline" locks
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
      experimentalAutoDetectLongPolling: true,
    });

    db._isDummy = false;
    console.log("🔥 Firebase initialized (Long Polling: ON)");
  } catch (err) {
    console.error("🔥 Firebase Init Error:", err);
    db = { _isDummy: true, error: err.message };
  }
} else {
  db = { _isDummy: true };
}

export { db, isConfigured };
