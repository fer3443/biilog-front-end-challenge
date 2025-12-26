import { Appointment, Professional, SlotStatus } from "@/types";
import { addMinutesToTime } from "@/utils/add-minutes-to-time";
import { hasAbsenceOnDate, isProfessionalEnabled, isWithInWorkingHours } from "./availability";

export const generateSlots = (from: string, to: string, interval = 30) => {
  const slots = [];
  let current = from;

  while (current < to) {
    const next = addMinutesToTime(current, interval);
    if (next > to) break;

    slots.push({ from: current, to: next });
    current = next;
  }
  return slots
}

export const resolveSlot = ({
  professional,
  date,
  from,
  to,
  appointments,
}: {
  professional: Professional;
  date: string;
  from: string;
  to: string;
  appointments: Appointment[];
}): {
  status: SlotStatus,
  appointment?: Appointment
} => {
  const appointment = appointments.find(
    a =>
      a.professional_id === professional.id &&
      a.date === date &&
      a.from === from
  );

  if (appointment) {
    return {
      status: "busy" as const,
      appointment,
    };
  }

  if (!isProfessionalEnabled(professional)) {
    return { status: "disabled" as const }
  }
  const absence = hasAbsenceOnDate(professional, date)
  if (absence) {
    return { status: "absence" as const };
  }

  const works = isWithInWorkingHours(professional, date, from, to);
  if (!works) {
    return { status: "disabled" as const };
  }

  return { status: "available" as const };
};

