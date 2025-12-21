import { Card } from '../ui/card';
import { format } from 'date-fns';
import { useFilteredProfessionals } from '@/store/professional.selector';
import { useAppointmentStore } from '@/store/appointment.store';

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

  const formattedDate = format(date, "yyyy-MM-dd")

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
              {timeSlots.map((time) => {
                const appointment = appointments.find(
                  (a) =>
                    a.professional_id === prof.id &&
                    a.date === formattedDate &&
                    a.from === time
                );

                return (
                  <div
                    key={time}
                    className={`${!prof.enabled ? "bg-red-300" : ""} h-16 border-b flex items-center justify-center text-xs cursor-pointer`}
                    onClick={() => { console.log("abrir dialog para turno") }}
                  >
                    {appointment ? (
                      <span className="rounded bg-primary px-2 py-1 text-primary-foreground">
                        {appointment.patient_name}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">{prof.enabled ? "Disponible" : "No disponible"}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Card>

    </div>
  )
}
