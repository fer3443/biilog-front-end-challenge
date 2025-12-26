import { type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { DragAppointmentIntent } from '@/types/drag';
import { moveAppointment } from '@/domain/drag';
import { toast } from 'sonner';
import { useAppointmentStore } from '@/store/appointment.store';
import { Appointment, Professional } from '@/types';



export const useHandleDrag = (appointments: Appointment[], selectedProfessional: Professional) => {
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
      target_professional_id: over.data.current?.professionalId as string ?? selectedProfessional.id
    };

    const result = moveAppointment(intent, appointments, selectedProfessional);
    if (!result.ok) {
      toast.error(result.reason)
      return;
    }

    applyUpdate(result.updatedAppointment!);
    toast.success(result.reason)
  }
  return {
    sensors,
    handleDragEnd
  }
}
