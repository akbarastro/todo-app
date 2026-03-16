import { useDroppable } from "@dnd-kit/core";

export default function DroppableCol({ id, color, label, icon, count, children, onAddTask }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const colBg = {
    todo: "#f8f9fa",
    progress: "#eef4ff",
    selesai: "#f0fff4",
  }[id] || "#f8f9fa";

  return (
    <div style={{ background: isOver ? color + "18" : colBg, borderRadius: "14px", padding: "16px", transition: "background 0.2s", border: `2px solid ${isOver ? color : "transparent"}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ color, fontSize: "16px" }}>{icon}</span>
          <span style={{ fontWeight: "700", fontSize: "15px", color: "#1a1a2e" }}>{label}</span>
        </div>
        <span style={{ background: color + "22", color, fontSize: "12px", fontWeight: "700", padding: "2px 10px", borderRadius: "20px" }}>{count}</span>
      </div>

      <div ref={setNodeRef} style={{ minHeight: "120px" }}>
        {count === 0 && (
          <div style={{ textAlign: "center", color: "#ccc", fontSize: "13px", padding: "30px 0", border: "2px dashed #e0e0e0", borderRadius: "10px" }}>Drop di sini</div>
        )}
        {children}
      </div>

      {/* Tombol Add Task */}
      <button
        onClick={() => onAddTask(id)}
        style={{ width: "100%", marginTop: "12px", padding: "9px", borderRadius: "10px", border: `1.5px dashed ${color}`, background: "transparent", color: color, cursor: "pointer", fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "background 0.15s" }}
        onMouseEnter={e => e.currentTarget.style.background = color + "11"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        ＋ Add Task
      </button>
    </div>
  );
}