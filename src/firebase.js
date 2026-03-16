import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyAEAdpU2MA6WQ_Eh62v6w2rXOhXYKCJuzQ",
  authDomain: "todo-app-dc966.firebaseapp.com",
  projectId: "todo-app-dc966",
  storageBucket: "todo-app-dc966.firebasestorage.app",
  messagingSenderId: "929257692202",
  appId: "1:929257692202:web:dc3b371985ee042a1eb753"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);