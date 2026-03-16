import { useState } from "react";
import { PRIORITY } from "../constants";

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 7AM - 8PM

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function getWeekDates(baseDate) {
  const start = new Date(baseDate);
  const day = start.getDay();
  start.setDate(start.getDate() - day);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function toDateStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function WeeklyCalendar({ todos, onView }) {
  const [baseDate, setBaseDate] = useState(new Date());
  const weekDates = getWeekDates(baseDate);
  const now = new Date();

  const prevWeek = () => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - 7);
    setBaseDate(d);
  };

  const nextWeek = () => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + 7);
    setBaseDate(d);
  };

  const getTodosForDateTime = (date, hour) => {
    const dateStr = toDateStr(date);
    return todos.filter(t => {
      if (t.deadline !== dateStr) return false;
      if (!t.time) return hour === 8; // default jam 8 kalau tidak ada waktu
      const h = parseInt(t.time.split(":")[0]);
      return h === hour;
    });
  };

  const getAllDayTodos = (date) => {
    const dateStr = toDateStr(date);
    return todos.filter(t => t.deadline === dateStr && !t.time);
  };

  const isToday = (date) => toDateStr(date) === toDateStr(now);
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeTop = ((currentHour - 7) * 60 + currentMinute);

  const PRIORITY_COLORS = {
    high: { bg: "#fff0f3", border: "#e94560", label: "#e94560" },
    medium: { bg: "#fff8e6", border: "#f0a500", label: "#f0a500" },
    low: { bg: "#f0fff4", border: "#4caf50", label: "#4caf50" },
  };

  return (
    <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", overflow: "hidden" }}>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #f0f0f0" }}>
        <button onClick={prevWeek} style={{ background: "#eef0ff", border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", color: "#4361ee", fontWeight: "600" }}>◀</button>
        <strong style={{ fontSize: "15px", color: "#1a1a2e" }}>
          {weekDates[0].toLocaleDateString("id-ID", { day: "numeric", month: "long" })} — {weekDates[6].toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
        </strong>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => setBaseDate(new Date())} style={{ background: "#eef0ff", border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", color: "#4361ee", fontSize: "12px", fontWeight: "600" }}>Hari Ini</button>
          <button onClick={nextWeek} style={{ background: "#eef0ff", border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", color: "#4361ee", fontWeight: "600" }}>▶</button>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: "900px" }}>

          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "60px repeat(7, 1fr)", borderBottom: "1px solid #f0f0f0" }}>
            <div style={{ padding: "12px", fontSize: "11px", color: "#aaa", textAlign: "center" }}>GMT+7</div>
            {weekDates.map((date, i) => {
              const dayTodos = getAllDayTodos(date);
              return (
                <div key={i} style={{ padding: "10px 8px", borderLeft: "1px solid #f0f0f0", background: isToday(date) ? "#eef0ff" : "white" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "11px", color: isToday(date) ? "#4361ee" : "#aaa", fontWeight: "600" }}>{DAYS[date.getDay()]}</span>
                    <span style={{ fontSize: "18px", fontWeight: "700", color: isToday(date) ? "#4361ee" : "#1a1a2e" }}>{date.getDate()}</span>
                  </div>
                  {dayTodos.length > 0 && (
                    <div style={{ fontSize: "10px", color: "#aaa" }}>{dayTodos.length} task</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* All day row */}
          <div style={{ display: "grid", gridTemplateColumns: "60px repeat(7, 1fr)", borderBottom: "2px solid #f0f0f0" }}>
            <div style={{ padding: "8px", fontSize: "10px", color: "#aaa", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>All Day</div>
            {weekDates.map((date, i) => {
              const dayTodos = getAllDayTodos(date);
              return (
                <div key={i} style={{ padding: "4px 6px", borderLeft: "1px solid #f0f0f0", minHeight: "36px", background: isToday(date) ? "#fafbff" : "white" }}>
                  {dayTodos.slice(0, 2).map(todo => {
                    const p = PRIORITY_COLORS[todo.priority || "medium"];
                    return (
                      <div key={todo.id} onClick={() => onView(todo)}
                        style={{ background: p.bg, borderLeft: `3px solid ${p.border}`, borderRadius: "4px", padding: "2px 6px", fontSize: "10px", color: p.label, fontWeight: "600", marginBottom: "2px", cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {todo.teks}
                      </div>
                    );
                  })}
                  {dayTodos.length > 2 && <div style={{ fontSize: "10px", color: "#aaa" }}>+{dayTodos.length - 2} more</div>}
                </div>
              );
            })}
          </div>

          {/* Time slots */}
          <div style={{ position: "relative", overflowY: "auto", maxHeight: "600px" }}>

            {/* Current time indicator */}
            {weekDates.some(d => isToday(d)) && currentHour >= 7 && currentHour <= 20 && (
              <div style={{ position: "absolute", left: "60px", right: 0, top: `${currentTimeTop}px`, zIndex: 10, pointerEvents: "none" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#e94560", flexShrink: 0 }} />
                  <div style={{ flex: 1, height: "2px", background: "#e94560" }} />
                </div>
              </div>
            )}

            {HOURS.map(hour => (
              <div key={hour} style={{ display: "grid", gridTemplateColumns: "60px repeat(7, 1fr)", minHeight: "60px" }}>
                {/* Hour label */}
                <div style={{ padding: "8px 4px", fontSize: "11px", color: "#aaa", textAlign: "right", paddingRight: "10px", paddingTop: "0", marginTop: "-8px" }}>
                  {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </div>

                {/* Day columns */}
                {weekDates.map((date, di) => {
                  const slotTodos = getTodosForDateTime(date, hour);
                  return (
                    <div key={di} style={{
                      borderLeft: "1px solid #f0f0f0",
                      borderTop: "1px solid #f0f0f0",
                      padding: "2px 4px",
                      background: isToday(date) ? "#fafbff" : "white",
                      minHeight: "60px",
                      position: "relative",
                    }}>
                      {slotTodos.map(todo => {
                        const p = PRIORITY_COLORS[todo.priority || "medium"];
                        const priorityLabel = PRIORITY[todo.priority || "medium"]?.label || "Medium";
                        return (
                          <div key={todo.id} onClick={() => onView(todo)}
                            style={{ background: p.bg, borderLeft: `3px solid ${p.border}`, borderRadius: "6px", padding: "4px 8px", fontSize: "11px", marginBottom: "2px", cursor: "pointer", transition: "opacity 0.2s" }}
                            onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                          >
                            <div style={{ fontWeight: "600", color: "#1a1a2e", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{todo.teks}</div>
                            <div style={{ fontSize: "10px", color: p.label, marginTop: "2px" }}>{priorityLabel}</div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}