"use client"

import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5";
import { addWeeks, format } from 'date-fns';
import { es } from 'date-fns/locale';

import { Button } from '../ui';
import { CalendarComponent } from "./CalendarComponent";
import { useCalendarStore } from "@/store/calendar.store";

export const WeeklyNavigator = () => {
  const onChange = useCalendarStore(state => state.setDate);
  const baseDate = useCalendarStore(state => state.selectedDate);

  return (
    <div className='w-full flex items-center gap-2 mb-4'>
      <CalendarComponent />
      <Button variant="ghost" className="hover:bg-gray-200 cursor-pointer rounded-full p-2" onClick={() => onChange(addWeeks(baseDate, -1))}><IoChevronBackOutline /></Button>
      <Button variant="ghost" className="hover:bg-gray-200 cursor-pointer rounded-full p-2" onClick={() => onChange(addWeeks(baseDate, 1))}><IoChevronForward /></Button>
      <p className='text-xl font-semibold capitalize'>{format(baseDate, "MMMM 'de' yyyy", { locale: es })}</p>
    </div>
  )
}
