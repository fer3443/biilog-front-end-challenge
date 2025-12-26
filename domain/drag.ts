import { Appointment, Professional } from "@/types";
import { DragAppointmentIntent } from "@/types/drag";
import { isProfessionalAvailable } from "./availability";
import { addMinutesToTime } from "@/utils/add-minutes-to-time";

interface MoveResult {
  ok: boolean;
  reason?: string;
  updatedAppointment?: Appointment;
}

export function moveAppointment(intent: DragAppointmentIntent, appointments: Appointment[], professional: Professional): MoveResult {
  const appointment = appointments.find((app) => app.id === intent.appointment_id);
  if (!appointment) {
    return { ok: false, reason: "No se encontró el turno" }
  }

  const updated: Appointment = {
    ...appointment,
    date: intent.target_date,
    from: intent.target_from,
    to: addMinutesToTime(intent.target_from, appointment.duration),
    professional_id: professional.id,
    professional_name: professional.name,
    updated_at: new Date()
  }

  const otherAppointments = appointments.filter((app) => app.id !== appointment.id);

  const isAvailable = isProfessionalAvailable(professional, otherAppointments, updated.date, updated.from, updated.to);
  if (!isAvailable) {
    return { ok: false, reason: "Turno no disponible" }
  }

  return {
    ok: true,
    reason: "Turno reprogramado con éxito",
    updatedAppointment: updated
  }
}