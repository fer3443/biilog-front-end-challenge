import { Appointment, SlotStatus } from "@/types";
import { AppointmentCard } from "../appointment/AppointmentCard";
import { isInThePast } from "@/domain/time";
import { cn } from "@/lib/utils";

interface TimeSlotProps {
  date: string;
  status: SlotStatus;
  slot: {
    from: string,
    to: string
  };
  appointment?: Appointment;
  onCreate?: () => void;
  onEdit?: (appointment: Appointment) => void;
}

export const TimeSlot = ({
  date,
  status,
  slot,
  appointment,
  onCreate,
  onEdit,
}: TimeSlotProps) => {

  const isPast = isInThePast(date, slot.from)

  if (status === "busy" && appointment) {
    return (
      <AppointmentCard
        appointment={appointment}
        onEdit={() => onEdit?.(appointment)}
      />
    );
  }

  if (status === "disabled") {
    return (
      <div className="h-12 border-b rounded-md bg-gray-50 text-gray-300 flex items-center justify-center cursor-not-allowed">
        <p className="text-xs">No disponible</p>
      </div>
    );
  }
  if (status === "absence") {
    return (
      <div className="h-12 border-b rounded-md bg-red-100 text-gray-300 flex items-center justify-center cursor-not-allowed">
        <p className="text-xs">No disponible</p>
      </div>
    );
  }

  return (
    <div
      className={cn("h-12 border-b rounded-md cursor-pointer hover:bg-green-200 flex flex-col items-center justify-center text-xs",
        isPast && "opacity-40 pointer-events-none"
      )}
      onClick={onCreate}
    >
      <p>Disponible</p>
      <p className="text-muted-foreground">{slot.from} - {slot.to}</p>
    </div>
  );
};
