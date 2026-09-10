import { useDroppable } from "@dnd-kit/core";

export function DroppableContainer({
  id,
  children,
  className = "",
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`${className} ${isOver ? "bg-green-50 ring-2 ring-green-500" : ""}`}
    >
      {children}
    </div>
  );
}
