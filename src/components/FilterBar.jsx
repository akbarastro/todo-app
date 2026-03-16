import { useRef, useState } from "react";
import { exportToExcel, importFromExcel } from "../utils/excelHandler";

export default function FilterBar({ view, setView, search, setSearch, filterPriority, setFilterPriority, filterUser, setFilterUser, members, todos, onAddTask }) {
  const fileInputRef = useRef();
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const result = await importFromExcel(file, todos);
      alert(`✅ Berhasil import ${result.length - todos.length} todo!`);
    } catch (err) {
      alert("❌ " + err);
    }
    e.target.value = "";
  };

  const hasFilter = search || filterPriority !== "semua" || filterUser !== "semua";

  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ background: "white", borderRadius: "12px", padding: "10px 16px", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f8f9fa", borderRadius: "8px", padding: "8px 12px", width: "220px" }}>
          <span style={{ color: "#aaa", fontSize: "14px" }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Task" style={{ border: "none", background: "none", outline: "none", fontSize: "13px", color: "#333", width: "100%" }} />
          {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "11px" }}>✕</button>}
        </div>

        <div style={{ width: "1px", height: "24px", background: "#e8e8e8" }} />

        {/* Filter Person */}
        <button onClick={() => setShowFilterPanel(o => !o)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", border: "1px solid #e8e8e8", background: filterUser !== "semua" ? "#eef0ff" : "white", color: filterUser !== "semua" ? "#4361ee" : "#555", cursor: "pointer", fontSize: "13px", fontWeight: "500" }}>
          <span>👤</span>
          <span>{filterUser === "semua" ? "Person" : filterUser}</span>
        </button>

        {/* Filter Priority */}
        <div style={{ position: "relative" }}>
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
            style={{ padding: "8px 28px 8px 14px", borderRadius: "8px", border: "1px solid #e8e8e8", background: filterPriority !== "semua" ? "#eef0ff" : "white", color: filterPriority !== "semua" ? "#4361ee" : "#555", cursor: "pointer", fontSize: "13px", fontWeight: "500", outline: "none", appearance: "none" }}>
            <option value="semua">All Priority</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
          <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "10px", color: "#aaa", pointerEvents: "none" }}>▾</span>
        </div>

        {hasFilter && (
          <button onClick={() => { setSearch(""); setFilterPriority("semua"); setFilterUser("semua"); }}
            style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #e94560", background: "white", color: "#e94560", cursor: "pointer", fontSize: "12px" }}>
            ✕ Reset
          </button>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* View Switcher */}
        <div style={{ display: "flex", background: "#f0f2f5", borderRadius: "8px", padding: "3px", gap: "2px" }}>
          {[["kanban", "⊞"], ["list", "☰"], ["calendar", "📅"], ["weekly", "📆"]].map(([v, icon]) => (
            <button key={v} onClick={() => setView(v)} title={v}
              style={{ padding: "6px 10px", borderRadius: "6px", border: "none", background: view === v ? "white" : "transparent", color: view === v ? "#1a1a2e" : "#aaa", cursor: "pointer", fontSize: "14px", boxShadow: view === v ? "0 1px 3px rgba(0,0,0,0.1)" : "none", transition: "all 0.15s" }}>
              {icon}
            </button>
          ))}
        </div>

        <div style={{ width: "1px", height: "24px", background: "#e8e8e8" }} />

        {/* Filter button */}
        <button onClick={() => setShowFilterPanel(o => !o)}
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "8px", border: "1px solid #e8e8e8", background: showFilterPanel ? "#f0f2f5" : "white", color: "#555", cursor: "pointer", fontSize: "13px", fontWeight: "500" }}>
          ⚙️ Filter
        </button>

        {/* New Task */}
        <button onClick={onAddTask}
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 18px", borderRadius: "8px", border: "none", background: "#1a1a2e", color: "white", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
          ＋ New Task
        </button>

        {/* Export/Import */}
        <button onClick={() => exportToExcel(todos)} style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #e8e8e8", background: "white", color: "#555", cursor: "pointer", fontSize: "13px" }} title="Export Excel">📥</button>
        <button onClick={() => fileInputRef.current.click()} style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #e8e8e8", background: "white", color: "#555", cursor: "pointer", fontSize: "13px" }} title="Import Excel">📤</button>
        <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleImport} style={{ display: "none" }} />

      </div>

      {/* Filter Panel */}
      {showFilterPanel && (
        <div style={{ background: "white", borderRadius: "12px", padding: "16px 20px", marginTop: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#555" }}>Filter by:</span>
          <select value={filterUser} onChange={e => setFilterUser(e.target.value)}
            style={{ padding: "7px 12px", borderRadius: "8px", border: "1px solid #e0e0e0", fontSize: "13px", outline: "none", background: "white", color: "#555" }}>
            <option value="semua">👤 All Members</option>
            {(members || []).map(m => <option key={m.uid} value={m.name}>👤 {m.name}</option>)}
          </select>
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}
            style={{ padding: "7px 12px", borderRadius: "8px", border: "1px solid #e0e0e0", fontSize: "13px", outline: "none", background: "white", color: "#555" }}>
            <option value="semua">🏷️ All Priority</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
          {hasFilter && (
            <button onClick={() => { setSearch(""); setFilterPriority("semua"); setFilterUser("semua"); }}
              style={{ padding: "7px 12px", borderRadius: "8px", border: "1px solid #e94560", background: "white", color: "#e94560", cursor: "pointer", fontSize: "13px" }}>
              ✕ Reset Filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}