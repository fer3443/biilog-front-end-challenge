import { Slot } from '@/types';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface Props {
  date: string;
  from: string;
  to: string;
  available: boolean;
  onCreate: (slot: Slot) => void;
}

export const TimeSlot = ({ date, from, to, available, onCreate }: Props) => {
  return (
    <Button
      disabled={!available}
      variant="ghost"
      onClick={() => onCreate({ date, from, to })}
      className={cn('h-16 w-full border-b flex items-center justify-center transition-colors',
        available ? "bg-green-200 border-green-400 hover:bg-green-300 cursor-pointer" : "bg-gray-100 cursor-not-allowed",
      )}
    >
      {from}
    </Button>
  )
};