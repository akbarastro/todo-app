import * as XLSX from "xlsx";
import { PRIORITY, KOLOM } from "../constants";

export const exportToExcel = (todos) => {
  const data = todos.map(t => ({
    "Nama Todo": t.teks,
    "Deskripsi": t.desc || "-",
    "Status": KOLOM[t.status]?.label || t.status,
    "Priority": PRIORITY[t.priority]?.label || t.priority,
    "Profit Center": t.profitCenters?.join(", ") || "-",
    "Assign To": t.user,
    "Deadline": t.deadline ? new Date(t.deadline).toLocaleDateString("id-ID") : "-",
    "Dibuat": t.createdAt,
  }));

  const ws = XLSX.utils.json_to_sheet(data.length > 0 ? data : [{}]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Todo List");
  XLSX.writeFile(wb, `TodoList_${new Date().toLocaleDateString("id-ID").replace(/\//g, "-")}.xlsx`);
};

export const importFromExcel = (file, existingTodos) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws);

        const statusMap = { "To Do": "todo", "In Progress": "progress", "Completed": "selesai" };
        const priorityMap = { "High Priority": "high", "Medium Priority": "medium", "Low Priority": "low" };

        const imported = rows.map(row => ({
          id: Date.now() + Math.random(),
          teks: row["Nama Todo"] || "Untitled",
          desc: row["Deskripsi"] !== "-" ? row["Deskripsi"] || "" : "",
          status: statusMap[row["Status"]] || "todo",
          priority: priorityMap[row["Priority"]] || "medium",
          profitCenters: row["Profit Center"] && row["Profit Center"] !== "-"
            ? String(row["Profit Center"]).split(", ")
            : [],
          user: row["Assign To"] || "Abay",
          deadline: row["Deadline"] && row["Deadline"] !== "-" ? parseDeadline(String(row["Deadline"])) : null,
          createdAt: row["Dibuat"] || new Date().toLocaleDateString("id-ID"),
        }));

        resolve([...existingTodos, ...imported]);
      } catch {
        reject("File tidak valid! Pastikan format Excel benar.");
      }
    };
    reader.onerror = () => reject("Gagal membaca file!");
    reader.readAsArrayBuffer(file);
  });
};

const parseDeadline = (dateStr) => {
  try {
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const [d, m, y] = parts;
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
    return null;
  } catch { return null; }
};