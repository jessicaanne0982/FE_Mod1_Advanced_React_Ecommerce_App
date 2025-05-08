//src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getEnvVar } from './getEnvVar';

async function getFirebaseConfig() {
  const firebaseConfig = {
   apiKey : await getEnvVar('VITE_FIREBASE_API_KEY'),
   authDomain : await getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
   projectId : await getEnvVar('VITE_FIREBASE_PROJECT_ID'),
   storageBucket : await getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
   messagingSenderId : await getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
   appId : await getEnvVar('VITE_FIREBASE_APP_ID'),
  }
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  return {
    auth, db
  }
};
// let auth: ReturnType<typeof getAuth> | null = null;
// let db: ReturnType<typeof getFirestore> | null = null;

const firebase = getFirebaseConfig();
export default firebase;

// initializeFirebase()
// export { auth, db }
