// Firebase configuration for Samskruthi Foods
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAYPDBWQp5nsXdSdArZZpGpJjBRpApoQh0",
  authDomain: "samskruthi-auth-b8ee6.firebaseapp.com",
  projectId: "samskruthi-auth-b8ee6",
  storageBucket: "samskruthi-auth-b8ee6.firebasestorage.app",
  messagingSenderId: "432703729927",
  appId: "1:432703729927:web:8fe24ee00bba99a77e55a2",
  measurementId: "G-L65Q0NZCB4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
