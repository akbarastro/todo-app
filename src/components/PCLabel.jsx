export default function PCLabel({ label, color, onRemove }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: color, color: "white", fontSize: "11px", fontWeight: "700", padding: "3px 8px 3px 10px", borderRadius: "6px" }}>
      {label}
      {onRemove && (
        <button onClick={onRemove} style={{ background: "rgba(255,255,255,0.3)", border: "none", borderRadius: "4px", color: "white", cursor: "pointer", fontSize: "10px", lineHeight: 1, padding: "1px 4px" }}>✕</button>
      )}
    </span>
  );
}