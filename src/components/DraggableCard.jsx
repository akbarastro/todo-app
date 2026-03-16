import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import CardContent from "./CardContent";

export default function DraggableCard({ todo, openModal, onDelete, isDeadlineLewat, onView }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: String(todo.id) });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}
      style={{ marginBottom: "10px", transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.3 : 1, cursor: "grab", touchAction: "none" }}>
      <CardContent todo={todo} openModal={openModal} onDelete={onDelete} isDeadlineLewat={isDeadlineLewat} onView={onView} />
    </div>
  );
}