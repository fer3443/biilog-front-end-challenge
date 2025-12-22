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
  notes?: string; // Notas del paciente o motivo de consulta
  created_at?: Date; // Cuándo se creó la cita
  updated_at?: string; // Última modificación
};