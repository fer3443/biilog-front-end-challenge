"use client"

import { addDays, format } from 'date-fns'
import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5";
import { useCalendarStore } from '@/store/calendar.store'
import { Button } from '../ui'

import { es } from 'date-fns/locale';

export const DayNavigator = () => {
  const baseDate = useCalendarStore(state => state.selectedDate)
  const setBaseDate = useCalendarStore(state => state.setDate)
  return (
    <div className='flex items-center gap-2'>
      <Button variant="ghost" className="hover:bg-gray-200 cursor-pointer rounded-full p-2" onClick={() => setBaseDate(addDays(baseDate, -1))}><IoChevronBackOutline /></Button>
      <Button variant="ghost" className="hover:bg-gray-200 cursor-pointer rounded-full p-2" onClick={() => setBaseDate(addDays(baseDate, 1))}><IoChevronForward /></Button>
      <p className='text-xl font-semibold capitalize'>{format(baseDate, "d 'de' MMMM 'de' yyyy", { locale: es })}</p>
    </div>
  )
}
