"use client"

import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5";
import { addWeeks, endOfWeek, format, startOfWeek } from 'date-fns';
import { Button } from '../ui';

interface Props {
  baseDate: Date;
  onChange: (date: Date) => void;
}

export const WeeklyNavigator = ({ baseDate, onChange }: Props) => {
  const start = startOfWeek(baseDate, { weekStartsOn: 1 });
  const end = endOfWeek(baseDate, { weekStartsOn: 1 });
  return (
    <div className='w-full flex items-center gap-4 bg-amber-300'>
      <Button variant="outline" onClick={() => onChange(addWeeks(baseDate, -1))}><IoChevronBackOutline /></Button>
      <Button variant="outline" onClick={() => onChange(addWeeks(baseDate, 1))}><IoChevronForward /></Button>
      <p className='text-xl font-semibold'>{format(start, "dd/MM")} - {format(end, "dd/MM")}</p>
    </div>
  )
}
