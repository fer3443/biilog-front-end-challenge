"use client"

import { Appointment, Professional } from '@/types'
import { WeeklyDayColumn } from './WeeklyDayColumn';
import { useMemo } from 'react';
import { getWeeklySlots } from '@/selectors/calendar.selector';
import { useCalendarStore } from '@/store/calendar.store';

interface Props {
  professional: Professional;
  appointments: Appointment[];
}

export const WeeklyCalendar = ({ professional, appointments }: Props) => {
  const baseDate = useCalendarStore(state => state.selectedDate)
  const week = useMemo(() => getWeeklySlots(professional, baseDate, appointments), [professional, baseDate, appointments])

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-7 gap-2'>
        {week.map((day) => {
          return (
            <WeeklyDayColumn
              key={day.date}
              date={day.date}
              slots={day.slots}
              professional={professional}
              appointments={appointments}
            />
          )
        })}
      </div>
    </div>
  )
}
