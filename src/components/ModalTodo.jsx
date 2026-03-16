import { useState } from "react";
import { PRIORITY, INPUT_STYLE } from "../constants";
import ProfitCenterPicker from "./ProfitCenterPicker";

export default function ModalTodo({ editTodo, input, setInput, desc, setDesc, deadline, setDeadline, startDate, setStartDate, assignTo, setAssignTo, priority, setPriority, selectedPC, setSelectedPC, onSave, onClose, members, setImageRef, checklist, setChecklist }) {
  const [imagePreview, setImagePreview] = useState(editTodo?.imageRef || null);
  const [imageError, setImageError] = useState("");
  const [newItem, setNewItem] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 500 * 1024) { setImageError("Ukuran gambar maksimal 500KB!"); return; }
    setImageError("");
    const reader = new FileReader();
    reader.onloadend = () => { setImagePreview(reader.result); setImageRef(reader.result); };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => { setImagePreview(null); setImageRef(null); };

  const addCheckItem = () => {
    if (!newItem.trim()) return;
    setChecklist([...checklist, { id: Date.now(), text: newItem.trim(), done: false }]);
    setNewItem("");
  };

  const toggleCheck = (id) => setChecklist(checklist.map(c => c.id === id ? { ...c, done: !c.done } : c));
  const removeCheck = (id) => setChecklist(checklist.filter(c => c.id !== id));

  const doneCount = checklist.filter(c => c.done).length;
  const progress = checklist.length > 0 ? Math.round((doneCount / checklist.length) * 100) : 0;

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(4px)" }}>
      <div style={{ background: "white", borderRadius: "16px", padding: "32px", width: "520px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700" }}>{editTodo ? "✏️ Edit Todo" : "➕ Tambah Todo Baru"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#aaa", fontSize: "20px", cursor: "pointer" }}>✖</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* Nama Todo */}
          <div>
            <label style={{ fontSize: "13px", color: "#888", marginBottom: "6px", display: "block", fontWeight: "500" }}>Nama Todo *</label>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && onSave()} placeholder="Contoh: Design landing page..." style={INPUT_STYLE} autoFocus />
          </div>

          {/* Deskripsi */}
          <div>
            <label style={{ fontSize: "13px", color: "#888", marginBottom: "6px", display: "block", fontWeight: "500" }}>Deskripsi</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Tambahkan deskripsi..." rows={3} style={{ ...INPUT_STYLE, resize: "vertical", fontFamily: "inherit" }} />
          </div>

          {/* Checklist */}
          <div>
            <label style={{ fontSize: "13px", color: "#888", marginBottom: "6px", display: "block", fontWeight: "500" }}>✅ Checklist <span style={{ color: "#bbb" }}>(opsional)</span></label>

            {checklist.length > 0 && (
              <div style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#aaa", marginBottom: "4px" }}>
                  <span>{doneCount}/{checklist.length} selesai</span>
                  <span>{progress}%</span>
                </div>
                <div style={{ background: "#f0f0f0", borderRadius: "10px", height: "6px", overflow: "hidden" }}>
                  <div style={{ width: `${progress}%`, height: "100%", background: progress === 100 ? "#4caf50" : "#4361ee", borderRadius: "10px", transition: "width 0.3s" }} />
                </div>
              </div>
            )}

            {checklist.map(c => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 0", borderBottom: "1px solid #f5f5f5" }}>
                <input type="checkbox" checked={c.done} onChange={() => toggleCheck(c.id)} style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "#4361ee" }} />
                <span style={{ flex: 1, fontSize: "13px", color: c.done ? "#aaa" : "#333", textDecoration: c.done ? "line-through" : "none" }}>{c.text}</span>
                <button onClick={() => removeCheck(c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ddd", fontSize: "14px" }}
                  onMouseEnter={e => e.currentTarget.style.color = "#e94560"}
                  onMouseLeave={e => e.currentTarget.style.color = "#ddd"}
                >✕</button>
              </div>
            ))}

            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <input value={newItem} onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === "Enter" && addCheckItem()} placeholder="Tambah item checklist..." style={{ ...INPUT_STYLE, flex: 1 }} />
              <button onClick={addCheckItem} style={{ padding: "10px 14px", borderRadius: "8px", border: "none", background: "#4361ee", color: "white", cursor: "pointer", fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap" }}>＋ Add</button>
            </div>
          </div>

          {/* Upload Gambar */}
          <div>
            <label style={{ fontSize: "13px", color: "#888", marginBottom: "6px", display: "block", fontWeight: "500" }}>🖼️ Referensi Gambar <span style={{ color: "#bbb" }}>(maks. 500KB)</span></label>
            {imagePreview ? (
              <div style={{ position: "relative", borderRadius: "10px", overflow: "hidden", border: "1px solid #e0e0e0" }}>
                <img src={imagePreview} alt="preview" style={{ width: "100%", maxHeight: "200px", objectFit: "cover", display: "block" }} />
                <button onClick={handleRemoveImage} style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: "28px", height: "28px", cursor: "pointer", color: "white", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
              </div>
            ) : (
              <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", padding: "24px", borderRadius: "10px", border: "2px dashed #e0e0e0", cursor: "pointer", background: "#fafafa" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#4361ee"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#e0e0e0"}
              >
                <span style={{ fontSize: "28px" }}>📁</span>
                <span style={{ fontSize: "13px", color: "#aaa" }}>Klik untuk upload gambar</span>
                <span style={{ fontSize: "11px", color: "#ccc" }}>PNG, JPG, WEBP — maks 500KB</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
              </label>
            )}
            {imageError && <p style={{ color: "#e94560", fontSize: "12px", marginTop: "6px" }}>{imageError}</p>}
          </div>

          {/* Profit Center */}
          <div>
            <label style={{ fontSize: "13px", color: "#888", marginBottom: "6px", display: "block", fontWeight: "500" }}>💎 Profit Center</label>
            <ProfitCenterPicker selected={selectedPC} onChange={setSelectedPC} />
          </div>

          {/* Due Date Range */}
          <div>
            <label style={{ fontSize: "13px", color: "#888", marginBottom: "6px", display: "block", fontWeight: "500" }}>📅 Due Date</label>
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "11px", color: "#bbb", display: "block", marginBottom: "4px" }}>Start Date</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={INPUT_STYLE} />
              </div>
              <span style={{ color: "#aaa", fontSize: "13px", paddingBottom: "11px" }}>→</span>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "11px", color: "#bbb", display: "block", marginBottom: "4px" }}>End Date</label>
                <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} style={INPUT_STYLE} />
              </div>
            </div>
          </div>

          {/* Assign To */}
          <div>
            <label style={{ fontSize: "13px", color: "#888", marginBottom: "6px", display: "block", fontWeight: "500" }}>Assign To</label>
            <select value={assignTo} onChange={e => setAssignTo(e.target.value)} style={INPUT_STYLE}>
              {(members || []).map(m => <option key={m.uid} value={m.name}>{m.name}</option>)}
            </select>
          </div>

          {/* Priority */}
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