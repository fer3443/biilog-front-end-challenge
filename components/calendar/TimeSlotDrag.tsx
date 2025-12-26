import { useDroppable } from "@dnd-kit/core";
import React from "react";

interface TimeSlotProps {
  date: string;
  from: string;
  professionalId: string;
  children: React.ReactNode;
}

export function TimeSlotDrag({ date, from, professionalId, children }: TimeSlotProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${professionalId}-${date}-${from}`,
    data: {
      date,
      from,
      professionalId
    }
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        ${isOver ? "bg-blue-100" : ""}
      `}
    >
      {children}
    </div>
  );
}