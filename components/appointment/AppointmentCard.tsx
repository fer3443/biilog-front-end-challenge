import { Appointment } from "@/types";
import { useDraggable } from "@dnd-kit/core";

interface Props {
  appointment: Appointment;
  onEdit?: (appointment: Appointment) => void;
}

export function AppointmentCard({ appointment, onEdit }: Props) {
  const { attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id: appointment.id,
      data: {
        appointmentId: appointment.id,
        professionalId: appointment.professional_id
      }
    });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      onClick={() => onEdit?.(appointment)}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="h-12 flex flex-col items-center justify-center border-b rounded-md bg-amber-100 px-2 text-xs hover:bg-amber-200 cursor-grab"
    >
      <div className="font-medium truncate w-full text-center">
        {appointment.patient_name}
      </div>
      <div className="text-muted-foreground truncate w-full text-center">
        {appointment.from} - {appointment.to}
      </div>
    </div>
  );
}
