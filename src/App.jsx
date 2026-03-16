import { useState, useEffect } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, DragOverlay, rectIntersection } from "@dnd-kit/core";
import useTodos from "./hooks/useTodos";
import useAuth from "./hooks/useAuth";
import { KOLOM, PRIORITY, PROFIT_CENTERS, BULAN, HARI } from "./constants";
import Sidebar from "./components/Sidebar";
import FilterBar from "./components/FilterBar";
import DraggableCard from "./components/DraggableCard";
import DroppableCol from "./components/DroppableCol";
import CardContent from "./components/CardContent";
import ModalTodo from "./components/ModalTodo";
import ModalDelete from "./components/ModalDelete";
import LoginPage from "./components/LoginPage";
import PCLabel from "./components/PCLabel";
import WeeklyCalendar from "./components/WeeklyCalendar";
import ModalView from "./components/ModalView";
import ModalSettings from "./components/ModalSettings";
import useNotifications from "./hooks/useNotifications";

export default function App() {
  const { user, login, logout, error, setError, loading, members, addMember, deleteMember } = useAuth();
  const { todos, tambahTodo, editTodoItem, hapusTodo, pindahStatus, isDeadlineLewat } = useTodos(user);
  const { notifications, unreadCount, markAllRead } = useNotifications(user);
  const [showNotif, setShowNotif] = useState(false);
  const [viewTodo, setViewTodo] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageRef, setImageRef] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest("[data-dropdown]")) setDropdownOpen(false);
      if (!e.target.closest("[data-notif]")) setShowNotif(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [input, setInput] = useState("");
  const [desc, setDesc] = useState("");
  const [deadline, setDeadline] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [priority, setPriority] = useState("medium");
  const [selectedPC, setSelectedPC] = useState([]);
  const [view, setView] = useState("kanban");
  const [filterUser, setFilterUser] = useState("semua");
  const [filterPriority, setFilterPriority] = useState("semua");
  const [search, setSearch] = useState("");
  const [kalenderBulan, setKalenderBulan] = useState(new Date().getMonth());
  const [kalenderTahun, setKalenderTahun] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeTodo, setActiveTodo] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>Loading...</div>;
  if (!user) return <LoginPage onLogin={login} error={error} setError={setError} />;

  const openModal = (todo = null) => {
    if (todo) {
      setEditTodo(todo); setInput(todo.teks); setDesc(todo.desc || "");
      setDeadline(todo.deadline || ""); setAssignTo(todo.user); setPriority(todo.priority || "medium");
      setSelectedPC(todo.profitCenters || []); setImageRef(todo.imageRef || null); // ← tambah ini
    } else {
      setEditTodo(null); setInput(""); setDesc(""); setDeadline("");
      setAssignTo(members[0]?.name || "");
      setPriority("medium"); setSelectedPC([]); setImageRef(null); // ← tambah ini
    }
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditTodo(null); };

  const simpan = () => {
    if (!input) return;
    const data = { teks: input, desc, deadline: deadline || null, user: assignTo, priority, profitCenters: selectedPC, imageRef: imageRef || null }; // ← tambah imageRef
    if (editTodo) editTodoItem(editTodo.id, data);
    else tambahTodo(data);
    closeModal();
  };

  const todosTampil = todos.filter(t => {
    const matchUser = filterUser === "semua" || t.user === filterUser;
    const matchPriority = filterPriority === "semua" || t.priority === filterPriority;
    const matchSearch = t.teks.toLowerCase().includes(search.toLowerCase());
    return matchUser && matchPriority && matchSearch;
  });

  const stats = {
    total: todos.length,
    selesai: todos.filter(t => t.status === "selesai").length,
    progress: todos.filter(t => t.status === "progress").length,
    lewat: todos.filter(t => isDeadlineLewat(t.deadline) && t.status !== "selesai").length,
  };

  const handleDragStart = ({ active }) => setActiveTodo(todos.find(t => String(t.id) === active.id) || null);
  const handleDragEnd = ({ active, over }) => {
    setActiveTodo(null);
    if (!over || !Object.keys(KOLOM).includes(over.id)) return;
    pindahStatus(active.id, over.id);
  };

  const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const getFirstDay = (m, y) => new Date(y, m, 1).getDay();
  const getTodosForDate = (day) => {
    const dateStr = `${kalenderTahun}-${String(kalenderBulan + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return todos.filter(t => t.deadline === dateStr);
  };

  const renderKanban = () => (
    <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", alignItems: "start" }}>
        {Object.entries(KOLOM).map(([key, col]) => {
          const colTodos = todosTampil.filter(t => t.status === key);
          return (
            <DroppableCol key={key} id={key} color={col.color} label={col.label} icon={col.icon} count={colTodos.length}
              onAddTask={() => openModal()} // ← tambah ini
            >
              {colTodos.map(todo => (
                <DraggableCard key={todo.id} todo={todo} openModal={openModal} onDelete={id => setConfirmDelete(id)} isDeadlineLewat={isDeadlineLewat} />
              ))}
            </DroppableCol>
          );
        })}
      </div>
      <DragOverlay>
        {activeTodo && (
          <div style={{ transform: "rotate(2deg)", width: "300px" }}>
            <CardContent todo={activeTodo} openModal={() => { }} onDelete={() => { }} isDeadlineLewat={isDeadlineLewat} style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );

  const renderList = () => (
    <div>
      {todosTampil.length === 0
        ? <p style={{ color: "#aaa" }}>Belum ada todo! 😴</p>
        : todosTampil.map(todo => {
          const p = PRIORITY[todo.priority || "medium"];
          const lewatDeadline = isDeadlineLewat(todo.deadline) && todo.status !== "selesai";
          return (
            <div key={todo.id} style={{ background: "white", padding: "16px", borderRadius: "12px", marginBottom: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: "600", color: "#1a1a2e", textDecoration: todo.status === "selesai" ? "line-through" : "none" }}>{todo.teks}</span>
                {todo.deadline && <span style={{ marginLeft: "12px", fontSize: "12px", color: lewatDeadline ? "#e94560" : "#aaa" }}>📅 {new Date(todo.deadline).toLocaleDateString("id-ID")}</span>}
                {todo.profitCenters?.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px" }}>
                    {todo.profitCenters.map(pc => {
                      const pcData = PROFIT_CENTERS.find(p => p.label === pc);
                      return <PCLabel key={pc} label={pc} color={pcData?.color || "#666"} />;
                    })}
                  </div>
                )}
              </div>
              <span style={{ background: p.bg, color: p.color, fontSize: "11px", padding: "3px 10px", borderRadius: "20px", whiteSpace: "nowrap" }}>• {p.label}</span>
              <span style={{ background: KOLOM[todo.status].color + "22", color: KOLOM[todo.status].color, fontSize: "11px", padding: "3px 10px", borderRadius: "20px", whiteSpace: "nowrap" }}>{KOLOM[todo.status].label}</span>
              <button onClick={() => openModal(todo)} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa" }}>✏️</button>
              <button onClick={() => setConfirmDelete(todo.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa" }}>🗑️</button>
            </div>
          );
        })}
    </div>
  );

  const renderKalender = () => {
    const days = getDaysInMonth(kalenderBulan, kalenderTahun);
    const firstDay = getFirstDay(kalenderBulan, kalenderTahun);
    const cells = [...Array(firstDay).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
    const today = new Date();
    const isToday = (d) => d === today.getDate() && kalenderBulan === today.getMonth() && kalenderTahun === today.getFullYear();
    return (
      <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <button onClick={() => kalenderBulan === 0 ? (setKalenderBulan(11), setKalenderTahun(y => y - 1)) : setKalenderBulan(b => b - 1)} style={{ background: "#eef0ff", border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", color: "#4361ee" }}>◀</button>
          <strong style={{ fontSize: "16px" }}>{BULAN[kalenderBulan]} {kalenderTahun}</strong>
          <button onClick={() => kalenderBulan === 11 ? (setKalenderBulan(0), setKalenderTahun(y => y + 1)) : setKalenderBulan(b => b + 1)} style={{ background: "#eef0ff", border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer", color: "#4361ee" }}>▶</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px", marginBottom: "8px" }}>
          {HARI.map(h => <div key={h} style={{ textAlign: "center", color: "#aaa", fontSize: "12px", fontWeight: "600" }}>{h}</div>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "6px" }}>
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const todosHari = getTodosForDate(day);
            const selected = selectedDate === day;
            return (
              <div key={i} onClick={() => setSelectedDate(selected ? null : day)}
                style={{ background: selected ? "#4361ee" : isToday(day) ? "#eef0ff" : "#fafafa", border: isToday(day) ? "1px solid #4361ee" : "1px solid #f0f0f0", borderRadius: "8px", padding: "8px 4px", textAlign: "center", cursor: "pointer", minHeight: "70px", color: selected ? "white" : "#1a1a2e" }}>
                <div style={{ fontWeight: "bold", marginBottom: "4px", fontSize: "13px" }}>{day}</div>
                {todosHari.slice(0, 2).map(t => {
                  const p = PRIORITY[t.priority || "medium"];
                  return <div key={t.id} style={{ background: selected ? "rgba(255,255,255,0.3)" : p.bg, color: p.color, borderRadius: "4px", fontSize: "10px", padding: "2px 4px", marginBottom: "2px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{t.teks}</div>;
                })}
                {todosHari.length > 2 && <div style={{ fontSize: "10px", color: "#aaa" }}>+{todosHari.length - 2}</div>}
              </div>
            );
          })}
        </div>
        {selectedDate && (
          <div style={{ marginTop: "20px" }}>
            <h3 style={{ marginBottom: "12px" }}>📅 {selectedDate} {BULAN[kalenderBulan]}</h3>
            {getTodosForDate(selectedDate).length === 0
              ? <p style={{ color: "#aaa" }}>Tidak ada todo.</p>
              : getTodosForDate(selectedDate).map(todo => {
                const p = PRIORITY[todo.priority || "medium"];
                return (
                  <div key={todo.id} style={{ background: "#fafafa", padding: "12px", borderRadius: "10px", marginBottom: "8px", borderLeft: `3px solid ${p.color}` }}>
                    <div style={{ fontWeight: "600" }}>{todo.teks}</div>
                    <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>👤 {todo.user} • {p.label}</div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f2f5", fontFamily: "'Segoe UI', sans-serif" }}>
      <Sidebar filterUser={filterUser} setFilterUser={setFilterUser} stats={stats} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "24px 30px 0", background: "#f0f2f5" }}>

          {/* HEADER */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h1 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "4px" }}>To Do List</h1>
              <p style={{ color: "#aaa", fontSize: "13px" }}>{new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

              {/* Notifikasi Bell */}
              <div style={{ position: "relative" }} data-notif>
                <button onClick={() => setShowNotif(o => !o)} style={{ position: "relative", background: "white", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "10px 14px", cursor: "pointer", fontSize: "18px" }}>
                  🔔
                  {unreadCount > 0 && (
                    <span style={{ position: "absolute", top: "-6px", right: "-6px", background: "#e94560", color: "white", borderRadius: "50%", fontSize: "11px", fontWeight: "700", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotif && (
                  <div style={{ position: "absolute", top: "110%", right: 0, background: "white", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", border: "1px solid #f0f0f0", width: "320px", zIndex: 100, maxHeight: "400px", overflowY: "auto" }}>
                    <div style={{ padding: "14px 16px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: "700", fontSize: "14px", color: "#1a1a2e" }}>🔔 Notifikasi</span>
                      {notifications.some(n => !n.read) && (
                        <button onClick={markAllRead} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#4361ee", fontWeight: "600" }}>
                          Tandai semua dibaca
                        </button>
                      )}
                    </div>
                    {notifications.length === 0
                      ? <div style={{ padding: "20px", textAlign: "center", color: "#aaa", fontSize: "13px" }}>Tidak ada notifikasi</div>
                      : notifications.map(n => {
                        const todo = todos.find(t => t.id === n.todoId);
                        return (
                          <div key={n.id}
                            onClick={() => { if (todo) { setViewTodo(todo); setShowNotif(false); } }}
                            style={{ padding: "12px 16px", borderBottom: "1px solid #f9f9f9", background: n.read ? "white" : "#f8f9ff", cursor: todo ? "pointer" : "default" }}
                            onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
                            onMouseLeave={e => e.currentTarget.style.background = n.read ? "white" : "#f8f9ff"}
                          >
                            <div style={{ fontSize: "13px", color: "#1a1a2e", fontWeight: n.read ? "400" : "600" }}>{n.message}</div>
                            <div style={{ fontSize: "11px", color: "#aaa", marginTop: "4px", display: "flex", justifyContent: "space-between" }}>
                              <span>{new Date(n.createdAt).toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" })} - {new Date(n.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" })} WIB</span>
                              {todo && <span style={{ color: "#4361ee" }}>Lihat task →</span>}
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                )}
              </div>{/* tutup data-notif */}

              {/* User dropdown */}
              <div style={{ position: "relative" }} data-dropdown>
                <button onClick={() => setDropdownOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 14px", borderRadius: "10px", border: "1px solid #e0e0e0", background: "white", cursor: "pointer" }}>
                  <span style={{ fontSize: "20px" }}>👤</span>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a2e" }}>{user.name}</div>
                    <div style={{ fontSize: "11px", color: "#aaa", textTransform: "capitalize" }}>{user.role}</div>
                  </div>
                  <span style={{ fontSize: "11px", color: "#aaa" }}>{dropdownOpen ? "▴" : "▾"}</span>
                </button>

                {dropdownOpen && (
                  <div style={{ position: "absolute", top: "110%", right: 0, background: "white", borderRadius: "10px", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", border: "1px solid #f0f0f0", minWidth: "160px", zIndex: 100 }}>
                    {user?.role === "admin" && (
                      <button onClick={() => { setShowSettings(true); setDropdownOpen(false); }}
                        style={{ width: "100%", padding: "12px 16px", border: "none", background: "none", cursor: "pointer", textAlign: "left", fontSize: "13px", color: "#4361ee", fontWeight: "500", display: "flex", alignItems: "center", gap: "8px", borderRadius: "10px" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#eef0ff"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}
                      >⚙️ Settings</button>
                    )}
                    <button onClick={() => { logout(); setDropdownOpen(false); }}
                      style={{ width: "100%", padding: "12px 16px", border: "none", background: "none", cursor: "pointer", textAlign: "left", fontSize: "13px", color: "#e94560", fontWeight: "500", display: "flex", alignItems: "center", gap: "8px", borderRadius: "10px" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fff0f3"}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}
                    >🚪 Logout</button>
                  </div>
                )}
              </div>{/* tutup data-dropdown */}

            </div>
          </div>{/* tutup HEADER */}

          {/* STAT CARDS */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
            {[
              { label: "TOTAL", value: stats.total, icon: "📋", color: "#4361ee", bg: "#eef0ff" },
              { label: "SELESAI", value: stats.selesai, icon: "✅", color: "#4caf50", bg: "#f0fff4" },
              { label: "PROGRESS", value: stats.progress, icon: "🔄", color: "#f0a500", bg: "#fff8e6" },
              { label: "OVERDUE", value: stats.lewat, icon: "⚠️", color: "#e94560", bg: "#fff0f3" },
            ].map(c => (
              <div key={c.label} style={{ background: "white", borderRadius: "12px", padding: "18px 22px", flex: 1, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ color: "#aaa", fontSize: "12px", fontWeight: "600" }}>{c.label}</span>
                  <div style={{ background: c.bg, borderRadius: "8px", padding: "6px", fontSize: "14px" }}>{c.icon}</div>
                </div>
                <div style={{ fontSize: "28px", fontWeight: "700", color: "#1a1a2e" }}>{c.value}</div>
              </div>
            ))}
          </div>

          {/* FILTER BAR */}
         <FilterBar
  view={view} setView={setView}
  search={search} setSearch={setSearch}
  filterPriority={filterPriority} setFilterPriority={setFilterPriority}
  filterUser={filterUser} setFilterUser={setFilterUser}
  members={members}
  todos={todos}
  onAddTask={() => openModal()}
/>

        </div>{/* tutup padding div */}

        {/* CONTENT */}
        <div style={{ flex: 1, padding: "0 30px 30px", overflowY: "auto" }}>
          {view === "kanban" && renderKanban()}
          {view === "list" && renderList()}
          {view === "calendar" && renderKalender()}
          {view === "weekly" && <WeeklyCalendar todos={todosTampil} openModal={openModal} onView={setViewTodo} />}
        </div>

      </div>{/* tutup flex-1 div */}

      {showModal && (
        <ModalTodo
          editTodo={editTodo} input={input} setInput={setInput} desc={desc} setDesc={setDesc}
          deadline={deadline} setDeadline={setDeadline} assignTo={assignTo} setAssignTo={setAssignTo}
          priority={priority} setPriority={setPriority} selectedPC={selectedPC} setSelectedPC={setSelectedPC}
          onSave={simpan} onClose={closeModal}
          members={members}
          imageRef={imageRef}
          setImageRef={setImageRef}
        />
      )}

      {confirmDelete && (
        <ModalDelete
          todo={todos.find(t => t.id === confirmDelete)}
          onConfirm={() => { hapusTodo(confirmDelete); setConfirmDelete(null); }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {viewTodo && (
        <ModalView
          todo={viewTodo}
          onEdit={() => { openModal(viewTodo); setViewTodo(null); }}
          onClose={() => setViewTodo(null)}
          isDeadlineLewat={isDeadlineLewat}
        />
      )}

      {showSettings && (
        <ModalSettings
          members={members}
          currentUser={user}
          onAdd={addMember}
          onDelete={deleteMember}
          onClose={() => setShowSettings(false)}
        />
      )}

    </div>
  );
}