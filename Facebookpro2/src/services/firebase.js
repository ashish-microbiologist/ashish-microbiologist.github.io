import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, push } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Aapke Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBHXRCfBKclKnOgAlRudIvQCSRdWTMFuZo",
  authDomain: "facebook-pro-2-f6509.firebaseapp.com",
  databaseURL: "https://facebook-pro-2-f6509-default-rtdb.firebaseio.com",
  projectId: "facebook-pro-2-f6509",
  storageBucket: "facebook-pro-2-f6509.firebasestorage.app",
  messagingSenderId: "333706514416",
  appId: "1:333706514416:android:357b1f2743299ec1685735"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Anonymous Sign In
export const signInAnonymous = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.log('Auth error:', error);
    return null;
  }
};