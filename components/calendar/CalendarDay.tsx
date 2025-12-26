import { TimeSlots } from './TimeSlots';
import { ProfessionalFilters } from '../filters/ProfessionalFilters';
import { useFilteredProfessionals } from '@/selectors/professional.selector';
import { format } from 'date-fns';
import { useCalendarStore } from '@/store/calendar.store';
import { useAppointmentStore } from '@/store/appointment.store';
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { DragAppointmentIntent } from '@/types/drag';
import { moveAppointment } from '@/domain/drag';
import { toast } from 'sonner';


export const CalendarDay = () => {
  const selectedDate = useCalendarStore(state => state.selectedDate);
  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  const professionals = useFilteredProfessionals(formattedDate);
  const appointments = useAppointmentStore(state => state.appointments);
  const applyUpdate = useAppointmentStore(state => state.applyAppointmentUpdate);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const intent: DragAppointmentIntent = {
      appointment_id: active.id as string,
      professional_id: active.data.current?.professional_id as string,
      target_date: over.data.current?.date as string,
      target_from: over.data.current?.from as string,
      target_professional_id: over.data.current?.professionalId as string
    };

    const targetProfessional = professionals.find((p) => p.id === intent.target_professional_id);

    const result = moveAppointment(intent, appointments, targetProfessional!);
    if (!result.ok) {
      toast.error(result.reason)
      return;
    }

    applyUpdate(result.updatedAppointment!);
    toast.success(result.reason)
  }

  return (
    <div className="grid grid-cols-12 items-start justify-between gap-4 fade-in">
      <div className='col-span-full'>
        <ProfessionalFilters />
      </div>
      <div className="col-span-full">
        <h3 className='text-xs font-semibold text-slate-500 text-center mb-2'>Para ver agenda semanal, click en el nombre del profesional</h3>
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
          <TimeSlots />
        </DndContext>
      </div>
    </div>
  )
}
