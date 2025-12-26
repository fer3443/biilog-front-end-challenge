
import { useCalendarStore } from '@/store/calendar.store';
import { Appointment, Professional } from '@/types';

export const useCalendarSelection = () => {
  const setAppointment = useCalendarStore(state => state.setAppointment);
  const setSlot = useCalendarStore(state => state.setSelectedSlot);
  const setProfessional = useCalendarStore(state => state.setSelectedProfessional);

  const handleDate = (prof: Professional, date: string, from: string, to: string, appointment?: Appointment) => {
    if (appointment) setAppointment(appointment);
    setProfessional(prof);
    setSlot({
      date,
      from,
      to
    })
  }

  return {
    handleDate
  }
}
