import { PRIORITY, PROFIT_CENTERS } from "../constants";
import UserAvatar from "./UserAvatar";
import PCLabel from "./PCLabel";

export default function CardContent({ todo, openModal, onDelete, isDeadlineLewat, style = {} }) {
  const lewat = isDeadlineLewat(todo.deadline) && todo.status !== "selesai";
  const p = PRIORITY[todo.priority || "medium"];

  return (
    <div style={{ background: "white", borderRadius: "12px", padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #f0f0f0", ...style }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <span style={{ background: p.bg, color: p.color, fontSize: "11px", fontWeight: "600", padding: "3px 10px", borderRadius: "20px" }}>• {p.label}</span>
        <div style={{ display: "flex", gap: "4px" }}>
          <button onPointerDown={e => e.stopPropagation()} onClick={() => openModal(todo)} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "14px" }}>✏️</button>
          <button onPointerDown={e => e.stopPropagation()} onClick={() => onDelete(todo.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: "14px" }}>🗑️</button>
        </div>
      </div>
      <div style={{ fontWeight: "600", fontSize: "14px", color: "#1a1a2e", marginBottom: "6px", textDecoration: todo.status === "selesai" ? "line-through" : "none" }}>{todo.teks}</div>
      {todo.desc && <div style={{ fontSize: "12px", color: "#888", marginBottom: "10px", lineHeight: "1.5" }}>{todo.desc}</div>}
      {todo.profitCenters?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "10px" }}>
          {todo.profitCenters.map(pc => {
            const pcData = PROFIT_CENTERS.find(p => p.label === pc);
            return <PCLabel key={pc} label={pc} color={pcData?.color || "#666"} />;
          })}
        </div>
      )}
      {todo.deadline && <div style={{ fontSize: "11px", color: lewat ? "#e94560" : "#888", marginBottom: "10px" }}>📅 {new Date(todo.deadline).toLocaleDateString("id-ID")} {lewat && "⚠️"}</div>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f5f5f5", paddingTop: "10px" }}>
        <UserAvatar name={todo.user} />
        <span style={{ fontSize: "11px", color: "#bbb" }}>🕒 {todo.createdAt}</span>
      </div>
    </div>
  );
}