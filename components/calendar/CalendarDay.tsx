"use client"

import React from 'react';
import { Calendar } from "@/components/ui/calendar"

interface Props {
  onDate: (date: Date) => void;
}
export const CalendarDay = ({ onDate }: Props) => {
  const [date, setDate] = React.useState<Date>(new Date());


  const handleDate = (date: Date = new Date()) => {
    setDate(date)
    onDate(date)
  }

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={handleDate}
      className="w-full rounded-lg"
    />
  )
}
