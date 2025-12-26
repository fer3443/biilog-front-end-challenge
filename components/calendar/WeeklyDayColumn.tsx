import { Appointment, Professional } from '@/types';
import { TimeSlot } from './TimeSlot';
import { resolveSlot } from '@/domain/slots';
import { useCalendarSelection } from '@/hooks/useCalendarSelection';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { TimeSlotDrag } from './TimeSlotDrag';


interface Props {
  professional: Professional
  appointments: Appointment[];
  date: string;
  slots: {
    from: string;
    to: string;
    available: boolean;
  }[];
}

export const WeeklyDayColumn = ({ professional, appointments, date, slots }: Props) => {
  const { handleDate } = useCalendarSelection();

  return (
    <div className='bg-slate-100 border rounded p-2 space-y-1'>
      <p className='uppercase text-center'>{format(parseISO(date), 'eee', { locale: es })}</p>
      <p className='font-semibold text-center text-sm'>{format(parseISO(date), 'dd', { locale: es })}</p>
      {
        !slots.length && (
          <p className='text-xs text-muted-foreground text-center'>No atiende</p>
        )
      }

      {
        slots.map((s) => {
          const slot = resolveSlot({ professional: professional, appointments, date, from: s.from, to: s.to });
          const slotInfo = { from: s.from, to: s.to }
          return (
            <TimeSlotDrag
              date={date}
              from={s.from}
              professionalId={professional.id}
              key={`${date}-${s.from}`}
            >
              <TimeSlot
                date={date}
                slot={slotInfo}
                status={slot.status}
                appointment={slot.appointment}
                onCreate={() =>
                  handleDate(
                    professional,
                    date,
                    s.from,
                    s.to,
                  )}
                onEdit={(appointment) =>
                  handleDate(
                    professional,
                    appointment.date,
                    appointment.from,
                    appointment.to,
                    appointment
                  )
                }
              />
            </TimeSlotDrag>
          )
        }
        )}
    </div>
  )
}
