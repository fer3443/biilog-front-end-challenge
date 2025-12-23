"use client"

import React from 'react';
import { Calendar } from "@/components/ui/calendar"
import { TimeSlots } from './TimeSlots';

export const CalendarDay = () => {
  const [date, setDate] = React.useState<Date>(new Date());
  const handleDate = (date: Date = new Date()) => setDate(date)

  return (
    <div className="grid grid-cols-12 items-start justify-between gap-4">
      <div className='col-span-3'>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDate}
          className="w-full rounded-lg shadow-lg"
        />
      </div>
      <div className="col-span-9">
        <TimeSlots date={date} />
      </div>
    </div>
  )
}
