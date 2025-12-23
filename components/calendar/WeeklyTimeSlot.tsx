import { Slot } from '@/types';
import { Button } from '../ui';
import { cn } from '@/lib/utils';

interface Props {
  date: string;
  from: string;
  to: string;
  available: boolean;
  onSelect: (slot: Slot) => void;
}

export const WeeklyTimeSlot = ({ date, from, to, onSelect, available }: Props) => {
  // const available = isSlotAvailable(professional, date, from, to, appointments);

  return (
    <Button
      disabled={!available}
      variant="ghost"
      onClick={() => onSelect({ date, from, to })}
      className={cn("w-full rounded-lg px-2 py-1 text-xs",
        available ? "bg-green-300 text-white hover:bg-green-500" : "bg-muted text-muted-foreground cursor-not-allowed"
      )}
    >{from}</Button>
  )
}
