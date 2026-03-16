import { useState, useEffect } from "react";
import { auth, db, firebaseConfig } from "../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  getAuth
} from "firebase/auth";
import { initializeApp, deleteApp } from "firebase/app";
import { doc, getDoc, setDoc, collection, onSnapshot, deleteDoc } from "firebase/firestore";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...docSnap.data() });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      setMembers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const login = async (email, password) => {
    try {
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Email atau password salah!");
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const addMember = async (email, password, name, role = "member") => {
    let secondaryApp;
    try {
      secondaryApp = initializeApp(firebaseConfig, "secondary");
      const secondaryAuth = getAuth(secondaryApp);
      const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), { name, email, role });
      await deleteApp(secondaryApp);
      return { success: true };
    } catch (e) {
      if (secondaryApp) await deleteApp(secondaryApp);
      return { success: false, message: e.message };
    }
  };

  const deleteMember = async (uid) => {
    try {
      await deleteDoc(doc(db, "users", uid));
      return { success: true };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  return { user, loading, login, logout, error, setError, members, addMember, deleteMember };
}