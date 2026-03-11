import { useState } from "react";

const ACCOUNTS = [
  { username: "abay", password: "abay123", name: "Abay", role: "admin" },
  { username: "budi", password: "budi123", name: "Budi", role: "member" },
  { username: "ani", password: "ani123", name: "Ani", role: "member" },
  { username: "sari", password: "sari123", name: "Sari", role: "member" },
];

export default function useAuth() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("auth-user");
    return saved ? JSON.parse(saved) : null;
  });
  const [error, setError] = useState("");

  const login = (username, password) => {
    const found = ACCOUNTS.find(
      a => a.username === username.toLowerCase() && a.password === password
    );
    if (found) {
      const userData = { username: found.username, name: found.name, role: found.role };
      localStorage.setItem("auth-user", JSON.stringify(userData));
      setUser(userData);
      setError("");
      return true;
    } else {
      setError("Username atau password salah!");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth-user");
    setUser(null);
  };

  return { user, login, logout, error, setError };
}