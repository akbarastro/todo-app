import { useRef } from "react";
import { exportToExcel, importFromExcel } from "../utils/excelHandler";

export default function FilterBar({ view, setView, search, setSearch, filterPriority, setFilterPriority, todos, setTodos }) {
  const fileInputRef = useRef();

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const result = await importFromExcel(file, todos);
      setTodos(result);
      alert(`✅ Berhasil import ${result.length - todos.length} todo!`);
    } catch (err) {
      alert("❌ " + err);
    }
    e.target.value = "";
  };

  return (
    <div style={{ background: "white", borderRadius: "12px", padding: "10px 16px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", flexWrap: "wrap" }}>

      {/* View Switcher */}
      <div style={{ display: "flex", gap: "4px" }}>
        {[["kanban", "🗂️ Kanban"], ["list", "📋 List"], ["calendar", "📅 Calendar"]].map(([v, label]) => (
          <button key={v} onClick={() => setView(v)} style={{ padding: "7px 14px", borderRadius: "8px", border: "none", background: view === v ? "#4361ee" : "#f0f2f5", color: view === v ? "white" : "#666", cursor: "pointer", fontSize: "13px", fontWeight: view === v ? "600" : "400" }}>
            {label}
          </button>
        ))}
        <button onClick={() => setView("weekly")} style={{ padding: "8px 14px", borderRadius: "8px", border: "none", background: view === "weekly" ? "#4361ee" : "transparent", color: view === "weekly" ? "white" : "#666", cursor: "pointer", fontSize: "13px", fontWeight: "500" }}>
          📅 Weekly
        </button>
      </div>

      <div style={{ width: "1px", height: "24px", background: "#e0e0e0" }} />

      {/* Search */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f8f9fa", borderRadius: "8px", padding: "7px 12px", flex: 1, minWidth: "180px" }}>
        <span style={{ color: "#aaa" }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name..." style={{ border: "none", background: "none", outline: "none", fontSize: "13px", color: "#333", width: "100%" }} />
        {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "12px" }}>✖</button>}
      </div>

      <div style={{ width: "1px", height: "24px", background: "#e0e0e0" }} />

      {/* Filter Priority */}
      <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{ padding: "7px 12px", borderRadius: "8px", border: "1px solid #e0e0e0", background: "white", color: "#666", fontSize: "13px", cursor: "pointer", outline: "none" }}>
        <option value="semua">🏷️ All Priority</option>
        <option value="high">🔴 High</option>
        <option value="medium">🟡 Medium</option>
        <option value="low">🟢 Low</option>
      </select>

      {(search || filterPriority !== "semua") && (
        <button onClick={() => { setSearch(""); setFilterPriority("semua"); }} style={{ padding: "7px 12px", borderRadius: "8px", border: "1px solid #e94560", background: "white", color: "#e94560", cursor: "pointer", fontSize: "13px" }}>
          ✖ Reset
        </button>
      )}

      <div style={{ width: "1px", height: "24px", background: "#e0e0e0" }} />

      {/* Export */}
      <button
        onClick={() => exportToExcel(todos)}
        style={{ padding: "7px 14px", borderRadius: "8px", border: "1px solid #4caf50", background: "white", color: "#4caf50", cursor: "pointer", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
        📥 Export
      </button>

      {/* Import */}
      <button
        onClick={() => fileInputRef.current.click()}
        style={{ padding: "7px 14px", borderRadius: "8px", border: "1px solid #4361ee", background: "white", color: "#4361ee", cursor: "pointer", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
        📤 Import
      </button>
      <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleImport} style={{ display: "none" }} />
    </div>
  );
}