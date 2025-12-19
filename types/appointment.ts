export type AppointmentStatus =
  | "scheduled"    // Cita programada (pendiente)
  | "confirmed"    // Cita confirmada por el paciente
  | "completed"    // Cita realizada
  | "cancelled"    // Cita cancelada
  | "no_show";      // Paciente no se presentó

export interface Appointment {
  id: string;
  professional_id: string;
  patient_name: string;
  patient_email?: string;
  patient_phone?: string;
  professional_name: string;
  date: string;
  from: string;
  to: string;
  status: AppointmentStatus;
  notes?: string; // Notas del paciente o motivo de consulta
  cancellation_reason?: string; // Razón de cancelación si aplica
  created_at: string; // Cuándo se creó la cita
  updated_at?: string; // Última modificación
  cancelled_at?: string; // Cuándo se canceló
};