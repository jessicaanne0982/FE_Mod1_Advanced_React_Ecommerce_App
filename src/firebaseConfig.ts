import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getEnvVar } from './getEnvVar';

// Asynchronously sets up the Firebase configuration 
async function getFirebaseConfig() {
  // Builds the Firebase config object using environment variables
  const firebaseConfig = {
   apiKey : await getEnvVar('VITE_FIREBASE_API_KEY'),
   authDomain : await getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
   projectId : await getEnvVar('VITE_FIREBASE_PROJECT_ID'),
   storageBucket : await getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
   messagingSenderId : await getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
   appId : await getEnvVar('VITE_FIREBASE_APP_ID'),
  };

  // Initialize the Firebase app with the provided config
  const app = initializeApp(firebaseConfig);

  // Initializes Firebase Authentication and Firestore instances
  const auth = getAuth(app);
  const db = getFirestore(app);

  // Returns both services to be used throughout the app
  return {
    auth, db
  }
};

const firebase = getFirebaseConfig();
export default firebase;


