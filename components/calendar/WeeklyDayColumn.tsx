import { Slot } from '@/types';
import { WeeklyTimeSlot } from './WeeklyTimeSlot';

interface Props {
  date: string;
  slots: {
    from: string;
    to: string;
    available: boolean;
  }[];
  onSelectSlot: (slot: Slot) => void;
}

export const WeeklyDayColumn = ({ date, slots, onSelectSlot }: Props) => {
  // const schedules = getScheduleForDay(professional, date);

  // if (schedules.length === 0) {
  //   return (
  //     <div className='boreder rounded-lg p-2 text-center text-muted-foreground'>
  //       <p className='font-semibold'>{label}</p>
  //       <p className='text-xs'>No atiende</p>
  //     </div>
  //   )
  // };
  return (
    <div className='border rounded p-2 space-y-1'>
      <p className='font-semibold text-center text-sm'>{date}</p>
      {
        !slots.length && (
          <p className='text-xs text-muted-foreground text-center'>No atiende</p>
        )
      }

      {/* <p className='font-semibold text-center'>{label}</p>*/}

      {
        slots.map((slot) =>
          <WeeklyTimeSlot
            key={`${date}-${slot.from}`}
            date={date}
            from={slot.from}
            to={slot.to}
            available={slot.available}
            onSelect={onSelectSlot}
          />
        )
      }
    </div>
  )
}
