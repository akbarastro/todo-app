import { useState } from "react";

export default function Sidebar({ filterUser, setFilterUser, stats, members }) {
  const [menuDesignerOpen, setMenuDesignerOpen] = useState(true);
  const { total, selesai, progress, lewat } = stats;

  return (
    <div style={{ width: "220px", background: "white", padding: "24px 16px", display: "flex", flexDirection: "column", gap: "4px", flexShrink: 0, boxShadow: "1px 0 4px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px", padding: "0 8px" }}>
        <span style={{ fontSize: "24px" }}>📝</span>
        <span style={{ fontWeight: "700", fontSize: "18px", color: "#1a1a2e" }}>Todo App</span>
      </div>

      <p style={{ color: "#bbb", fontSize: "11px", marginBottom: "6px", letterSpacing: "1px", padding: "0 8px" }}>MENU</p>

      <button onClick={() => setMenuDesignerOpen(o => !o)} style={{ padding: "10px 14px", borderRadius: "8px", border: "none", background: "#f0f2f5", color: "#1a1a2e", cursor: "pointer", fontSize: "14px", width: "100%", textAlign: "left", fontWeight: "600", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>👥 Designer</span>
        <span style={{ fontSize: "11px", color: "#aaa", display: "inline-block", transform: menuDesignerOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
      </button>

      {menuDesignerOpen && (
        <div style={{ paddingLeft: "8px", display: "flex", flexDirection: "column", gap: "2px", marginTop: "2px" }}>
          {["semua", ...members.map(m => m.name)].map(u => (
            <button key={u} onClick={() => setFilterUser(u)} style={{ padding: "9px 14px", borderRadius: "8px", border: "none", background: filterUser === u ? "#4361ee" : "transparent", color: filterUser === u ? "white" : "#666", cursor: "pointer", fontSize: "13px", width: "100%", textAlign: "left", fontWeight: filterUser === u ? "600" : "400" }}>
              👤 {u}
            </button>
          ))}
        </div>
      )}

      <div style={{ marginTop: "auto", background: "#f8f9ff", borderRadius: "10px", padding: "14px", fontSize: "13px", color: "#666", lineHeight: "2" }}>
        <div>📋 Total: <strong>{total}</strong></div>
        <div>✅ Selesai: <strong>{selesai}</strong></div>
        <div>🔄 Progress: <strong>{progress}</strong></div>
        <div style={{ color: lewat > 0 ? "#e94560" : "#666" }}>⚠️ Lewat: <strong>{lewat}</strong></div>
      </div>
    </div>
  );
}