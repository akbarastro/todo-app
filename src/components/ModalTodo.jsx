import { USERS, PRIORITY, INPUT_STYLE } from "../constants";
import ProfitCenterPicker from "./ProfitCenterPicker";

export default function ModalTodo({ editTodo, input, setInput, desc, setDesc, deadline, setDeadline, assignTo, setAssignTo, priority, setPriority, selectedPC, setSelectedPC, onSave, onClose }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
      <div style={{ background: "white", borderRadius: "16px", padding: "32px", width: "520px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700" }}>{editTodo ? "✏️ Edit Todo" : "➕ Tambah Todo Baru"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#aaa", fontSize: "20px", cursor: "pointer" }}>✖</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "13px", color: "#888", marginBottom: "6px", display: "block", fontWeight: "500" }}>Nama Todo *</label>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && onSave()} placeholder="Contoh: Design landing page..." style={INPUT_STYLE} autoFocus />
          </div>
          <div>
            <label style={{ fontSize: "13px", color: "#888", marginBottom: "6px", display: "block", fontWeight: "500" }}>Deskripsi</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Tambahkan deskripsi..." rows={3} style={{ ...INPUT_STYLE, resize: "vertical", fontFamily: "inherit" }} />
          </div>
          <div>
            <label style={{ fontSize: "13px", color: "#888", marginBottom: "6px", display: "block", fontWeight: "500" }}>💎 Profit Center</label>
            <ProfitCenterPicker selected={selectedPC} onChange={setSelectedPC} />
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "13px", color: "#888", marginBottom: "6px", display: "block", fontWeight: "500" }}>Deadline</label>
              <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} style={INPUT_STYLE} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "13px", color: "#888", marginBottom: "6px", display: "block", fontWeight: "500" }}>Assign To</label>
              <select value={assignTo} onChange={e => setAssignTo(e.target.value)} style={INPUT_STYLE}>
                {USERS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: "13px", color: "#888", marginBottom: "8px", display: "block", fontWeight: "500" }}>Priority</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {Object.entries(PRIORITY).map(([key, p]) => (
                <button key={key} onClick={() => setPriority(key)} style={{ flex: 1, padding: "8px", borderRadius: "8px", border: `2px solid ${priority === key ? p.color : "#e0e0e0"}`, background: priority === key ? p.bg : "white", color: priority === key ? p.color : "#aaa", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
                  • {p.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #e0e0e0", background: "white", color: "#666", cursor: "pointer", fontSize: "14px" }}>Batal</button>
          <button onClick={onSave} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none", background: "#4361ee", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
            {editTodo ? "💾 Simpan" : "➕ Tambah"}
          </button>
        </div>
      </div>
    </div>
  );
}