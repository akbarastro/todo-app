import { useState } from "react";
import { PROFIT_CENTERS, INPUT_STYLE } from "../constants";
import PCLabel from "./PCLabel";

export default function ProfitCenterPicker({ selected, onChange }) {
  const [open, setOpen] = useState(false);
  const [searchPC, setSearchPC] = useState("");

  const filtered = PROFIT_CENTERS.filter(pc =>
    pc.label.toLowerCase().includes(searchPC.toLowerCase()) && !selected.includes(pc.label)
  );

  return (
    <div style={{ position: "relative" }}>
      <div onClick={() => setOpen(o => !o)} style={{ minHeight: "42px", padding: "6px 10px", borderRadius: "8px", border: "1px solid #e0e0e0", background: "white", cursor: "pointer", display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
        {selected.length === 0 && <span style={{ color: "#bbb", fontSize: "13px" }}>Pilih Profit Center...</span>}
        {selected.map(pc => {
          const pcData = PROFIT_CENTERS.find(p => p.label === pc);
          return <PCLabel key={pc} label={pc} color={pcData?.color || "#666"} onRemove={(e) => { e?.stopPropagation(); onChange(selected.filter(s => s !== pc)); }} />;
        })}
        <span style={{ marginLeft: "auto", color: "#aaa", fontSize: "11px" }}>{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "white", border: "1px solid #e0e0e0", borderRadius: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 300, overflow: "hidden" }}>
          <div style={{ padding: "8px" }}>
            <input autoFocus value={searchPC} onChange={e => setSearchPC(e.target.value)} placeholder="Search for an option..." style={{ ...INPUT_STYLE, fontSize: "13px", padding: "8px 10px" }} />
          </div>
          <div style={{ maxHeight: "200px", overflowY: "auto", padding: "4px 8px 8px" }}>
            <p style={{ fontSize: "11px", color: "#aaa", marginBottom: "6px", padding: "0 4px" }}>Select an option or create one</p>
            {filtered.length === 0 && <p style={{ color: "#bbb", fontSize: "13px", textAlign: "center", padding: "12px" }}>Tidak ada opsi</p>}
            {filtered.map(pc => (
              <div key={pc.label} onClick={() => { onChange([...selected, pc.label]); setSearchPC(""); }}
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 8px", borderRadius: "6px", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <span style={{ color: "#ccc", fontSize: "12px" }}>⠿</span>
                <PCLabel label={pc.label} color={pc.color} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}