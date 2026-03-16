import { useState } from "react";

export default function LoginPage({ onLogin, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ background: "white", padding: "40px", borderRadius: "20px", width: "380px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>📋 Todo App</h1>
        <p style={{ color: "#aaa", fontSize: "13px", marginBottom: "28px" }}>Login untuk melanjutkan</p>

        {error && (
          <div style={{ background: "#fff0f3", color: "#e94560", padding: "10px 14px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "16px" }}>
          <label htmlFor="email" style={{ fontSize: "13px", fontWeight: "600", color: "#555", display: "block", marginBottom: "6px" }}>Email</label>
          <input
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            placeholder="email@example.com"
            style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label htmlFor="password" style={{ fontSize: "13px", fontWeight: "600", color: "#555", display: "block", marginBottom: "6px" }}>Password</label>
          <input
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            placeholder="••••••••"
            onKeyDown={e => e.key === "Enter" && onLogin(email, password)}
            style={{ width: "100%", padding: "11px 14px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <button
          onClick={() => onLogin(email, password)}
          style={{ width: "100%", padding: "13px", borderRadius: "10px", background: "#4361ee", color: "white", border: "none", cursor: "pointer", fontSize: "15px", fontWeight: "600" }}
        >
          Login →
        </button>
      </div>
    </div>
  );
}