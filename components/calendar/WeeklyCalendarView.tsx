"use client"

import { WeeklyNavigator } from '@/components/calendar/WeeklyNavigator';
import { WeeklyCalendar } from '@/components/calendar/WeeklyCalendar';
import { Professional } from '@/types';
import { useCalendarStore } from '@/store/calendar.store';
import { useAppointmentStore } from '@/store/appointment.store';
import { Button } from '../ui';
import { DndContext } from '@dnd-kit/core';
import { useHandleDrag } from '@/hooks/useHandleDrag';


export const WeeklyCalendarView = () => {
  const selectedProfessional = useCalendarStore(state => state.selectedProfessional) as Professional;
  const appointments = useAppointmentStore(state => state.appointments);
  const goToDailyView = useCalendarStore(state => state.goToDailyView);
  const { sensors, handleDragEnd } = useHandleDrag(appointments, selectedProfessional)

  return (

    <div className='space-y-4 mt-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Agenda semanal de {selectedProfessional.name}</h2>
        <Button variant="outline" onClick={goToDailyView}>vista diaria</Button>
      </div>
      <WeeklyNavigator />
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <WeeklyCalendar
          appointments={appointments}
          professional={selectedProfessional}
        />
      </DndContext>
    </div>

  )
}
