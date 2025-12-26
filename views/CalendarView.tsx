"use client"

import { AppointmentDialog } from '@/components/appointment';
import { CalendarDay, WeeklyCalendarView } from '@/components/calendar';
import { useCalendarStore } from '@/store/calendar.store';

export const CalendarView = () => {
  const calendarView = useCalendarStore(state => state.calendarView)
  const selectedProfessional = useCalendarStore(state => state.selectedProfessional);
  const selectedSlot = useCalendarStore(state => state.selectedSlot)
  const setSelectedSlot = useCalendarStore(state => state.setSelectedSlot);
  const setAppointment = useCalendarStore(state => state.setAppointment);
  const appointment = useCalendarStore(state => state.appointment);

  return (
    <>
      {calendarView === "daily" && <CalendarDay />}

      {calendarView === "weekly" && selectedProfessional && (<WeeklyCalendarView />)}

      {selectedSlot && selectedProfessional && (
        <AppointmentDialog
          open
          onOpen={() => {
            setSelectedSlot(null)
            setAppointment(undefined)
          }}
          professional={selectedProfessional}
          date={selectedSlot.date}
          from={selectedSlot.from}
          to={selectedSlot.to}
          appointment={appointment}
        />
      )}
    </>
  )
}
