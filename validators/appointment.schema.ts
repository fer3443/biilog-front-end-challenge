import z from "zod";

export const AppointmentSchema = z.object({
  id: z.uuid(),
  professional_id: z.uuid(),
  professional_name: z.string(),
  patient_name: z.string().min(1, "El nombre del paciente es obligatorio"),
  patient_email: z.email().optional().or(z.literal("")),
  patient_phone: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  from: z.string().regex(/^\d{2}:\d{2}$/),
  to: z.string().regex(/^\d{2}:\d{2}$/),
  notes: z.string().optional(),
  craeted_at: z.string(),
  updated_at: z.string().optional(),
});

export type AppointmentValues = z.infer<typeof AppointmentSchema>;