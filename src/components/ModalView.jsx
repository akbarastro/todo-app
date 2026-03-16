import { PRIORITY, KOLOM, PROFIT_CENTERS } from "../constants";
import PCLabel from "./PCLabel";

export default function ModalView({ todo, onEdit, onClose, isDeadlineLewat }) {
  if (!todo) return null;
  const p = PRIORITY[todo.priority || "medium"];
  const col = KOLOM[todo.status];
  const lewat = isDeadlineLewat(todo.deadline) && todo.status !== "selesai";

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
      onClick={onClose}>
      <div style={{ background: "white", borderRadius: "16px", padding: "32px", width: "460px", maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
              <span style={{ background: p.bg, color: p.color, fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontWeight: "600" }}>● {p.label}</span>
              <span style={{ background: col.color + "22", color: col.color, fontSize: "11px", padding: "3px 10px", borderRadius: "20px", fontWeight: "600" }}>{col.label}</span>
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1a1a2e", lineHeight: 1.3 }}>{todo.teks}</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: "#aaa", marginLeft: "12px" }}>✕</button>
        </div>

        {/* Description */}
        {todo.desc && (
          <div style={{ background: "#f8f9fa", borderRadius: "10px", padding: "14px", marginBottom: "16px" }}>
            <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7, margin: 0 }}>{todo.desc}</p>
          </div>
        )}

        {/* Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
          {todo.deadline && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "14px" }}>📅</span>
              <span style={{ fontSize: "13px", color: lewat ? "#e94560" : "#555", fontWeight: lewat ? "600" : "400" }}>
                {new Date(todo.deadline).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                {lewat && " — Overdue!"}
              </span>
            </div>
          )}
          {todo.user && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "14px" }}>👤</span>
              <span style={{ fontSize: "13px", color: "#555" }}>{todo.user}</span>
            </div>
          )}
          {todo.createdAt && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "14px" }}>🕐</span>
              <span style={{ fontSize: "13px", color: "#aaa" }}>Dibuat: {todo.createdAt}</span>
            </div>
          )}
        </div>

        {/* Profit Centers */}
        {todo.profitCenters?.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "11px", fontWeight: "600", color: "#aaa", letterSpacing: "1px", marginBottom: "8px", textTransform: "uppercase" }}>Profit Center</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {todo.profitCenters.map(pc => {
                const pcData = PROFIT_CENTERS.find(p => p.label === pc);
                return <PCLabel key={pc} label={pc} color={pcData?.color || "#666"} />;
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px", borderTop: "1px solid #f0f0f0", paddingTop: "20px" }}>
          <button onClick={onEdit} style={{
            flex: 1, padding: "12px", borderRadius: "10px", border: "none",
            background: "#4361ee", color: "white", cursor: "pointer",
            fontSize: "14px", fontWeight: "600",
          }}>
            ✏️ Edit Task
          </button>
          <button onClick={onClose} style={{
            padding: "12px 20px", borderRadius: "10px", border: "1px solid #e0e0e0",
            background: "white", color: "#666", cursor: "pointer", fontSize: "14px",
          }}>
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}