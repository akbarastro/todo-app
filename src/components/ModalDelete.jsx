export default function ModalDelete({ todo, onConfirm, onCancel }) {
  return (
    <div onClick={onCancel} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: "16px", padding: "32px", width: "380px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🗑️</div>
        <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "8px", color: "#1a1a2e" }}>Hapus Todo?</h2>
        <p style={{ color: "#888", fontSize: "14px", marginBottom: "24px" }}>
          Todo "<strong>{todo?.teks}</strong>" akan dihapus permanen!
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #e0e0e0", background: "white", color: "#666", cursor: "pointer", fontSize: "14px" }}>Batal</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "none", background: "#e94560", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>🗑️ Hapus</button>
        </div>
      </div>
    </div>
  );
}