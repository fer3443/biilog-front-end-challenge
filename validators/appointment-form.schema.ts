import z from "zod";

export const AppointmentFormSchema = z.object({
  patient_name: z.string().min(1, "El nombre del paciente es obligatorio"),
  patient_email: z.email("El email debe ser válido"),
  patient_phone: z.string().optional(),
  notes: z.string().optional(),
  date: z.string(),
  from: z.string(),
  to: z.string(),
  duration: z.number()
});

export type AppointmentFormValues = z.infer<typeof AppointmentFormSchema>;