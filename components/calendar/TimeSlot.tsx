import { Appointment, Professional } from '@/types';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { getSlotStatus } from '@/domain/availability';

interface OnCreateProps {
  professional: Professional;
  date: string;
  from: string;
  to: string;
}

interface Props {
  appointments: Appointment[];
  professional: Professional;
  date: string;
  from: string;
  to: string;
  onCreate: (arg: OnCreateProps) => void;
}

export const TimeSlot = ({ appointments, professional, date, from, to, onCreate }: Props) => {
  const status = getSlotStatus(professional, appointments, date, from, to);

  const isDisabled = status !== "available";
  return (
    <Button
      disabled={isDisabled}
      variant="ghost"
      onClick={() => onCreate({ professional, date, from, to })}
      className={cn('h-16 w-full border-b flex items-center justify-center transition-colors',
        status === "available" && "hover:bg-muted cursor-pointer",
        status === "occupied" && "hover:bg-yellow-300 cursor-not-allowed",
        status === "unavailable" && "hover:bg-red-400! cursor-not-allowed"
      )}
    >
      {status === "available" && "Disponible"}
      {status === "occupied" && "Ocupado"}
      {status === "unavailable" && "No disponible"}
    </Button>
  )
}