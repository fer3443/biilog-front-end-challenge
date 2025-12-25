import React from 'react';

import { Appointment, Professional } from '@/types';
import { TimeSlot } from './TimeSlot';
import { resolveSlot } from '@/domain/slots';
import { useCalendarSelection } from '@/hooks/useCalendarSelection';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';


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
    <div className='border rounded p-2 space-y-1'>
      <p className='uppercase text-center'>{format(date, "EE", { locale: es })}</p>
      <p className='font-semibold text-center text-sm'>{format(date, "dd")}</p>
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
            <TimeSlot
              key={`${date}-${s.from}`}
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
            />)
        }
        )}
    </div>
  )
}
