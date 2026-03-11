import { useState, useEffect } from "react";

export default function useTodos() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos-v7");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("todos-v7", JSON.stringify(todos));
  }, [todos]);

  const tambahTodo = (data) => {
    setTodos(prev => [...prev, { id: Date.now(), status: "todo", createdAt: new Date().toLocaleDateString("id-ID"), ...data }]);
  };

  const editTodoItem = (id, data) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  };

  const hapusTodo = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const pindahStatus = (id, newStatus) => {
    setTodos(prev => prev.map(t => String(t.id) === String(id) ? { ...t, status: newStatus } : t));
  };

  const isDeadlineLewat = (dl) => dl && new Date(dl) < new Date();

  return { todos, setTodos, tambahTodo, editTodoItem, hapusTodo, pindahStatus, isDeadlineLewat };
}