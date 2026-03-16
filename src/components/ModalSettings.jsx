import { useState } from "react";

export default function ModalSettings({ members, currentUser, onAdd, onDelete, onClose }) {
  const [tab, setTab] = useState("members");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleAdd = async () => {
    if (!name || !email || !password) return setMsg({ type: "error", text: "Semua field wajib diisi!" });
    setLoadingAdd(true);
    const result = await onAdd(email, password, name, role);
    setLoadingAdd(false);
    if (result.success) {
      setMsg({ type: "success", text: `Member "${name}" berhasil ditambahkan!` });
      setName(""); setEmail(""); setPassword(""); setRole("member");
    } else {
      setMsg({ type: "error", text: result.message });
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "white", borderRadius: "20px", width: "480px", maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>

        {/* Header */}
        <div style={{ padding: "24px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1a1a2e" }}>⚙️ Settings</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#aaa" }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", padding: "16px 28px 0" }}>
          {["members", "add"].map(t => (
            <button key={t} onClick={() => { setTab(t); setMsg(null); }} style={{ padding: "8px 18px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "600", background: tab === t ? "#4361ee" : "#f0f2f5", color: tab === t ? "white" : "#666" }}>
              {t === "members" ? "👥 Members" : "➕ Tambah Member"}
            </button>
          ))}
        </div>

        <div style={{ padding: "20px 28px 28px", overflowY: "auto" }}>

          {/* Tab Members */}
          {tab === "members" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {members.length === 0 && <p style={{ color: "#aaa", fontSize: "14px" }}>Belum ada member.</p>}
              {members.map(m => (
                <div key={m.uid} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "12px", background: "#f8f9ff", border: "1px solid #eef0ff" }}>
                  <span style={{ fontSize: "22px" }}>👤</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "600", fontSize: "14px", color: "#1a1a2e" }}>{m.name}</div>
                    <div style={{ fontSize: "12px", color: "#aaa" }}>{m.email} • <span style={{ textTransform: "capitalize", color: m.role === "admin" ? "#4361ee" : "#f0a500" }}>{m.role}</span></div>
                  </div>
                  {m.uid !== currentUser.uid && (
                    <button onClick={() => onDelete(m.uid)} style={{ background: "#fff0f3", border: "none", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", color: "#e94560", fontSize: "12px", fontWeight: "600" }}>
                      Hapus
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tab Tambah Member */}
          {tab === "add" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {msg && (
                <div style={{ padding: "10px 14px", borderRadius: "8px", fontSize: "13px", background: msg.type === "error" ? "#fff0f3" : "#f0fff4", color: msg.type === "error" ? "#e94560" : "#4caf50" }}>
                  {msg.text}
                </div>
              )}
              {[
                { label: "Nama", value: name, set: setName, type: "text", placeholder: "Nama lengkap" },
                { label: "Email", value: email, set: setEmail, type: "email", placeholder: "email@example.com" },
                { label: "Password", value: password, set: setPassword, type: "password", placeholder: "Min. 6 karakter" },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "#555", display: "block", marginBottom: "6px" }}>{f.label}</label>
                  <input value={f.value} onChange={e => f.set(e.target.value)} type={f.type} placeholder={f.placeholder}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px", outline: "none", boxSizing: "border-box" }} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "#555", display: "block", marginBottom: "6px" }}>Role</label>
                <select value={role} onChange={e => setRole(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e0e0e0", fontSize: "14px", outline: "none", background: "white" }}>
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button onClick={handleAdd} disabled={loadingAdd}
                style={{ padding: "12px", borderRadius: "10px", background: "#4361ee", color: "white", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "600", opacity: loadingAdd ? 0.7 : 1 }}>
                {loadingAdd ? "Menambahkan..." : "➕ Tambah Member"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}