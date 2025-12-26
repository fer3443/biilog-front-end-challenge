// import React from 'react';

import { Card } from '../ui/card';
import { format } from 'date-fns';
import { useFilteredProfessionals } from '@/selectors/professional.selector';
import { useAppointmentStore } from '@/store/appointment.store';
import { TimeSlot } from './TimeSlot';
import { useCalendarStore } from '@/store/calendar.store';
import { generateSlots, resolveSlot } from '@/domain/slots';
import { useCalendarSelection } from '@/hooks/useCalendarSelection';
import { TimeSlotDrag } from './TimeSlotDrag';

const timeSlots = generateSlots("08:00", "18:00", 60);
const professionalTimeSlots = generateSlots("08:00", "18:00")

export const TimeSlots = () => {
  const selectedDate = useCalendarStore(state => state.selectedDate);
  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  const professionals = useFilteredProfessionals(formattedDate);
  const appointments = useAppointmentStore(state => state.appointments);
  const goToWeeklyView = useCalendarStore(state => state.goToWeeklyView)
  const { handleDate } = useCalendarSelection()

  return (
    <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
      <Card className="p-4 overflow-x-auto">
        <div className="grid grid-cols-[80px_repeat(auto-fill,minmax(200px,1fr))]">
          {/* Columna de horas */}
          <div className="flex flex-col">
            <div className='h-12 border-b text-sm text-muted-foreground flex items-center justify-start pr-2'>Horario</div>
            {timeSlots.map((time, index) => (
              <div
                key={`${time.from} - ${index}`}
                className="h-24 border-b text-sm text-muted-foreground flex items-center justify-start pr-2"
              >
                {time.from}
              </div>
            ))}
          </div>
          {/*col de prof */}
          {professionals.map((prof, index) => (
            <div key={prof.id} className={`flex flex-col border-l ${index === professionals.length - 1 ? "border-r" : ""}`}>
              <div
                className="h-12 border-b text-sm font-medium flex items-center justify-center cursor-pointer"
                onClick={() => goToWeeklyView(prof)}
              >
                {prof.name}
              </div>
              {
                professionalTimeSlots.map((time) => {
                  const slot = resolveSlot({ professional: prof, date: formattedDate, from: time.from, to: time.to, appointments })
                  const slotInfo = { from: time.from, to: time.to }
                  return (
                    <TimeSlotDrag
                      date={formattedDate}
                      from={time.from}
                      professionalId={prof.id}
                      key={`${prof.id}-${time.from}`}
                    >
                      <TimeSlot
                        slot={slotInfo}
                        status={slot.status}
                        appointment={slot.appointment}
                        onCreate={() =>
                          handleDate(
                            prof,
                            formattedDate,
                            time.from,
                            time.to,
                          )
                        }
                        onEdit={(appointment) =>
                          handleDate(
                            prof,
                            appointment.date,
                            appointment.from,
                            appointment.to,
                            appointment,
                          )
                        }
                      />
                    </TimeSlotDrag>
                  )
                })
              }
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
