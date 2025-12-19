import z from "zod";

export const WeekDaySchema = z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]);
export const ScheduleSchema = z.object({
  day: WeekDaySchema,
  from: z.string().regex(/^\d{2}:\d{2}$/),
  to: z.string().regex(/^\d{2}:\d{2}$/)
});

export const AbsenceSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string()
});

export const ProfessionalSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  enabled: z.boolean(),
  schedules: z.array(ScheduleSchema),
  absences: z.array(AbsenceSchema),
  created_at: z.string()
});

export const ProfessionalResponseSchema = z.array(ProfessionalSchema);