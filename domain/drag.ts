import { Appointment, Professional } from "@/types";
import { DragAppointmentIntent } from "@/types/drag";
import { canMoveAppointment } from "./availability";

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

  const result = canMoveAppointment(appointment, professional, intent.target_date, intent.target_from, appointments);

  if (!result.canMove) {
    return { ok: false, reason: result.reason }
  }

  return {
    ok: true,
    reason: "Turno reprogramado con éxito",
    updatedAppointment: result.updatedAppointment
  }
}