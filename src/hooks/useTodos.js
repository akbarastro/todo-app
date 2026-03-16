import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, orderBy, where
} from "firebase/firestore";

export default function useTodos(user) {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Admin lihat semua, member lihat milik sendiri
    const q = user.role === "admin"
      ? query(collection(db, "todos"), orderBy("createdAt", "desc"))
      : query(collection(db, "todos"), where("user", "==", user.name), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      setTodos(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [user]);

  const tambahTodo = async (data) => {
    await addDoc(collection(db, "todos"), {
      ...data,
      status: "todo",
      createdAt: new Date().toISOString(),
    });
  };

  const editTodoItem = async (id, data) => {
    await updateDoc(doc(db, "todos", id), data);
  };

  const hapusTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  const pindahStatus = async (id, newStatus) => {
    await updateDoc(doc(db, "todos", id), { status: newStatus });
  };

  const isDeadlineLewat = (dl) => dl && new Date(dl) < new Date();

  return { todos, tambahTodo, editTodoItem, hapusTodo, pindahStatus, isDeadlineLewat };
}