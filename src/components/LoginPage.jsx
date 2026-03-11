import { useState } from "react";

export default function LoginPage({ onLogin, error, setError }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) { setError("Isi username dan password dulu!"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // simulasi loading
    onLogin(username, password);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #4361ee 0%, #7209b7 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* Card */}
      <div style={{ background: "white", borderRadius: "24px", padding: "48px 40px", width: "420px", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}>
        
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📝</div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#1a1a2e", marginBottom: "6px" }}>Todo App</h1>
          <p style={{ color: "#aaa", fontSize: "14px" }}>Masuk untuk melanjutkan</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "#fff0f3", border: "1px solid #e94560", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", color: "#e94560", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#555", marginBottom: "8px", display: "block" }}>Username</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>👤</span>
              <input
                value={username}
                onChange={e => { setUsername(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="Masukkan username..."
                style={{ width: "100%", padding: "12px 14px 12px 42px", borderRadius: "10px", border: "1.5px solid #e0e0e0", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "border 0.2s" }}
                onFocus={e => e.target.style.borderColor = "#4361ee"}
                onBlur={e => e.target.style.borderColor = "#e0e0e0"}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#555", marginBottom: "8px", display: "block" }}>Password</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔒</span>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="Masukkan password..."
                style={{ width: "100%", padding: "12px 42px 12px 42px", borderRadius: "10px", border: "1.5px solid #e0e0e0", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: "border 0.2s" }}
                onFocus={e => e.target.style.borderColor = "#4361ee"}
                onBlur={e => e.target.style.borderColor = "#e0e0e0"}
              />
              <button onClick={() => setShowPass(s => !s)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#aaa" }}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ padding: "14px", borderRadius: "10px", border: "none", background: loading ? "#a0b0f5" : "linear-gradient(135deg, #4361ee, #7209b7)", color: "white", fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", marginTop: "8px", transition: "opacity 0.2s" }}>
            {loading ? "⏳ Masuk..." : "🚀 Masuk"}
          </button>
        </div>

        {/* Hint akun */}
        <div style={{ marginTop: "28px", background: "#f8f9ff", borderRadius: "12px", padding: "16px" }}>
          <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "8px", fontWeight: "600" }}>AKUN TERSEDIA:</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
            {[["abay", "abay123", "Admin"], ["budi", "budi123", "Member"], ["ani", "ani123", "Member"], ["sari", "sari123", "Member"]].map(([u, p, r]) => (
              <div key={u} onClick={() => { setUsername(u); setPassword(p); setError(""); }}
                style={{ background: "white", borderRadius: "8px", padding: "8px 10px", cursor: "pointer", border: "1px solid #e8e8e8", fontSize: "12px" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#4361ee"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#e8e8e8"}>
                <div style={{ fontWeight: "600", color: "#1a1a2e" }}>👤 {u}</div>
                <div style={{ color: "#aaa" }}>{r}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}