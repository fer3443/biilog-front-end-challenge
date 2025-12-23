import { isSlotAvailable } from "@/domain/availability";
import { getScheduleForDay } from "@/domain/schedule";
import { generateSlots } from "@/domain/slots";
import { Appointment, Professional } from "@/types";
import { addDays, format, startOfWeek } from "date-fns";

interface CalendarSlot {
  date: string;
  from: string;
  to: string;
  available: boolean;
}

export const getDailySlots = (
  professional: Professional,
  date: string,
  appointments: Appointment[]
): CalendarSlot[] => {
  const schedules = getScheduleForDay(professional, date);
  if (schedules.length === 0) return [];

  return schedules.flatMap(schedule =>
    generateSlots(schedule.from, schedule.to).map(slot => ({
      date,
      from: slot.from,
      to: slot.to,
      available: isSlotAvailable(
        professional,
        date,
        slot.from,
        slot.to,
        appointments
      )
    }))
  )
}

export const getWeeklySlots = (
  professional: Professional,
  startDate: Date,
  appointments: Appointment[]
) => {
  const weekStart = startOfWeek(startDate, { weekStartsOn: 1 });

  const weeklySlots = Array.from({ length: 7 }).map((_, i) => {
    const day = addDays(weekStart, i);
    const date = format(day, "yyyy-MM-dd");

    const schedules = getScheduleForDay(professional, date);
    if (!schedules.length) {
      return {
        date,
        slots: []
      }
    }
    const slots = schedules.flatMap(schedule =>
      generateSlots(schedule.from, schedule.to).map(slot => ({
        from: slot.from,
        to: slot.to,
        available: isSlotAvailable(
          professional,
          date,
          slot.from,
          slot.to,
          appointments
        ),
      }))
    );

    return { date, slots }
  });

  return weeklySlots
}

type ViewMode = "daily" | "weekly"

export const getCalendarSlots = (
  mode: ViewMode,
  professional: Professional,
  baseDate: Date,
  appointments: Appointment[]
) => {
  if (mode === "daily") {
    return getDailySlots(professional, format(baseDate, "yyyy-MM-dd"), appointments)
  }

  return getWeeklySlots(professional, baseDate, appointments)
}