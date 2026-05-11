import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.firebasestorage.app",
  messagingSenderId: "your-id",
  appId: "your-app-id"
};

// Check if we are in demo mode (no valid API key)
export const isDemoMode = firebaseConfig.apiKey === "YOUR_API_KEY";

// Initialize Firebase
let app, auth, db;

if (!isDemoMode) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };
