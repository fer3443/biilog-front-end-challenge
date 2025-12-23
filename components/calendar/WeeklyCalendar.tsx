"use client"

import { Appointment, Professional, Slot } from '@/types'
import { WeeklyDayColumn } from './WeeklyDayColumn';
import { useMemo } from 'react';
import { getWeeklySlots } from '@/selectors/calendar.selector';

interface Props {
  professional: Professional;
  appointments: Appointment[];
  baseDate: Date;
  onSelectSlot: (slot: Slot) => void;
}

export const WeeklyCalendar = ({ professional, appointments, baseDate, onSelectSlot }: Props) => {
  const week = useMemo(() => getWeeklySlots(professional, baseDate, appointments), [professional, baseDate, appointments])
  // const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 });


  // const days = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, 1));
  // const formatedDay = (day: Date) => {
  //   return format(day, "yyyy-MM-dd")
  // }

  // const label = (day: Date) => {
  //   return format(day, "EEE dd")
  // }

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-7 gap-2'>
        {week.map((day) => (
          <WeeklyDayColumn
            key={day.date}
            date={day.date}
            slots={day.slots}
            onSelectSlot={onSelectSlot}
          />
        ))}
      </div>
    </div>
  )
}
