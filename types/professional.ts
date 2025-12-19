export interface Schedule {
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  from: string;
  to: string;
}

export interface Absence {
  date: string;
  reason: string;
}

export interface Professional {
  id: string;
  name: string;
  enabled: boolean;
  schedules: Schedule[];
  absences: Absence[];
  created_at: string;
}

export type Professionals = Professional[];