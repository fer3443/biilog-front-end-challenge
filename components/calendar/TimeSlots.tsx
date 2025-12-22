import React from 'react';

import { Card } from '../ui/card';
import { format } from 'date-fns';
import { useFilteredProfessionals } from '@/store/professional.selector';
import { useAppointmentStore } from '@/store/appointment.store';
import { TimeSlot } from './TimeSlot';
import { addMinutesToTime } from '@/utils/add-minutes-to-time';
import { Professional } from '@/types';
import { AppointmentDialog } from '../appointment/AppointmentDialog';

interface DialogProps {
  professional: Professional;
  date: string;
  from: string;
  to: string;
}

interface Props {
  date: Date;
}

const generateTimeSlots = (start = 8, end = 18) => {
  const slots: string[] = [];
  for (let h = start; h < end; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
  }
  return slots;
};

export const TimeSlots = ({ date }: Props) => {
  const professionals = useFilteredProfessionals();
  const appointments = useAppointmentStore(state => state.appointments)
  const timeSlots = generateTimeSlots();
  const [dialogData, setDialogData] = React.useState<DialogProps | null>(null);

  const formattedDate = format(date, "yyyy-MM-dd");

  return (
    <div className='bg-white border rounded-lg overflow-hidden'>
      <Card className="p-4 overflow-x-auto">
        <div className="grid grid-cols-[80px_repeat(auto-fill,minmax(200px,1fr))]">
          {/* Columna de horas */}
          <div className="flex flex-col">
            <div className='h-16 border-b text-sm text-muted-foreground flex items-center justify-start pr-2'>Horas</div>
            {timeSlots.map((time) => (
              <div
                key={time}
                className="h-16 border-b text-sm text-muted-foreground flex items-center justify-start pr-2"
              >
                {time}
              </div>
            ))}
          </div>
          {/*col de prof */}
          {professionals.map((prof, index) => (
            <div key={prof.id} className={`flex flex-col border-l ${index === professionals.length - 1 ? "border-r" : ""}`}>
              <div className="h-16 border-b text-sm font-medium flex items-center justify-center">
                {prof.name}
              </div>
              {
                timeSlots.map((time) => (
                  <TimeSlot
                    key={`${prof.id}-${time}`}
                    appointments={appointments}
                    date={formattedDate}
                    professional={prof}
                    from={time}
                    to={addMinutesToTime(time, 60)}
                    onCreate={({ date, from, to }) => setDialogData({ date, from, to, professional: prof })}
                  />
                ))
              }
            </div>
          ))}
        </div>
      </Card>
      {dialogData && (
        <AppointmentDialog
          open={!!dialogData}
          onOpen={(isOpen) => !isOpen && setDialogData(null)}
          professional={dialogData.professional}
          date={dialogData.date}
          from={dialogData.from}
          to={dialogData.to}
        />
      )}
    </div>
  )
}
