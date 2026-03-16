import { useState } from "react";
import { PRIORITY, INPUT_STYLE } from "../constants";
import ProfitCenterPicker from "./ProfitCenterPicker";

export default function ModalTodo({ editTodo, input, setInput, desc, setDesc, deadline, setDeadline, assignTo, setAssignTo, priority, setPriority, selectedPC, setSelectedPC, onSave, onClose, members, setImageRef }) {
  const [imagePreview, setImagePreview] = useState(editTodo?.imageRef || null);
  const [imageError, setImageError] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      setImageError("Ukuran gambar maksimal 500KB!");
      return;
    }
    setImageError("");
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageRef(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageRef(null);
  };

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
                {members.map(m => <option key={m.uid} value={m.name}>{m.name}</option>)}
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