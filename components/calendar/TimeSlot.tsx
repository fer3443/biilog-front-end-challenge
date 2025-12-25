import { Appointment, SlotStatus } from "@/types";

interface TimeSlotProps {
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
  status,
  slot,
  appointment,
  onCreate,
  onEdit,
}: TimeSlotProps) => {
  if (status === "busy" && appointment) {
    return (
      <div
        className="h-12 flex flex-col items-center justify-center border-b rounded-md bg-amber-100 px-2 text-xs cursor-pointer hover:bg-amber-200"
        onClick={() => onEdit?.(appointment)}
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

  if (status === "disabled") {
    return (
      <div className="h-12 border-b rounded-md bg-gray-50 text-gray-300 flex items-center justify-center">
        <p className="text-xs">No disponible</p>
      </div>
    );
  }

  return (
    <div
      className="h-12 border-b rounded-md cursor-pointer hover:bg-green-200 flex flex-col items-center justify-center text-xs"
      onClick={onCreate}
    >
      <p>Disponible</p>
      <p className="text-muted-foreground">{slot.from} - {slot.to}</p>
    </div>
  );
};
