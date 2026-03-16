import { PRIORITY, PROFIT_CENTERS } from "../constants";
import UserAvatar from "./UserAvatar";
import PCLabel from "./PCLabel";

export default function CardContent({ todo, openModal, onDelete, isDeadlineLewat, onView, style = {} }) {
  const lewat = isDeadlineLewat(todo.deadline) && todo.status !== "selesai";
  const p = PRIORITY[todo.priority || "medium"];

  const doneCount = todo.checklist?.filter(c => c.done).length || 0;
  const totalCheck = todo.checklist?.length || 0;
  const pct = totalCheck > 0 ? Math.round((doneCount / totalCheck) * 100) : 0;

  return (
    <div style={{ background: "white", borderRadius: "12px", padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #f0f0f0", ...style }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <span style={{ background: p.bg, color: p.color, fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "20px" }}>• {p.label}</span>
        <div style={{ display: "flex", gap: "4px" }}>
          {onView && (
            <button onPointerDown={e => e.stopPropagation()} onClick={() => onView(todo)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "14px" }}>👁️</button>
          )}
          <button onPointerDown={e => e.stopPropagation()} onClick={() => openModal(todo)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "14px" }}>✏️</button>
          <button onPointerDown={e => e.stopPropagation()} onClick={() => onDelete(todo.id)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "14px" }}>🗑️</button>
        </div>
      </div>

      <div style={{ fontWeight: "600", fontSize: "14px", color: "#1a1a2e", marginBottom: "6px", textDecoration: todo.status === "selesai" ? "line-through" : "none" }}>{todo.teks}</div>
      {todo.desc && <div style={{ fontSize: "12px", color: "#888", marginBottom: "10px", lineHeight: "1.5" }}>{todo.desc}</div>}

      {/* Gambar */}
      {todo.imageRef && (
        <div style={{ marginBottom: "10px", borderRadius: "8px", overflow: "hidden", border: "1px solid #f0f0f0" }}>
          <img src={todo.imageRef} alt="referensi" style={{ width: "100%", maxHeight: "120px", objectFit: "cover", display: "block" }} />
        </div>
      )}

      {/* Profit Centers */}
      {todo.profitCenters?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "10px" }}>
          {todo.profitCenters.map(pc => {
            const pcData = PROFIT_CENTERS.find(p => p.label === pc);
            return <PCLabel key={pc} label={pc} color={pcData?.color || "#666"} />;
          })}
        </div>
      )}

      {/* Progress bar checklist */}
      {totalCheck > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#aaa", marginBottom: "3px" }}>
            <span>{doneCount}/{totalCheck} done</span>
            <span>{pct}%</span>
          </div>
          <div style={{ background: "#f0f0f0", borderRadius: "10px", height: "5px", overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? "#4caf50" : "#4361ee", borderRadius: "10px", transition: "width 0.3s" }} />
          </div>
        </div>
      )}

      {/* Due date range */}
      {(todo.startDate || todo.deadline) && (
        <div style={{ fontSize: "11px", color: lewat ? "#e94560" : "#888", marginBottom: "10px" }}>
          📅 {todo.startDate ? new Date(todo.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : ""}
          {todo.startDate && todo.deadline ? " → " : ""}
          {todo.deadline ? new Date(todo.deadline).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : ""}
          {lewat && " ⚠️"}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f5f5f5", paddingTop: "10px" }}>
        <UserAvatar name={todo.user} />
        <span style={{ fontSize: "11px", color: "#bbb" }}>🕒 {new Date(todo.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })} - {new Date(todo.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" })} WIB</span>
      </div>
    </div>
  );
}