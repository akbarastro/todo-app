export default function UserAvatar({ name }) {
  return (
    <div style={{ width: "54px", height: "28px", borderRadius: "50%", background: "#4361ee", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700" }}>
      {name}
    </div>
  );
}