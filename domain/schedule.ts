import { Professional, Schedule } from "@/types";

export const getWeekDay = (date: string) => {
  const day = new Date(date + 'T00:00:00').toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  return day
};

export const getScheduleForDay = (professional: Professional, date: string): Schedule[] => {
  const day = getWeekDay(date);
  const schedulesForDay = professional.schedules.filter((schedule) => schedule.day === day);
  return schedulesForDay;
}

export const workOnDay = (professional: Professional, date: string): boolean => {
  return getScheduleForDay(professional, date).length > 0;
}