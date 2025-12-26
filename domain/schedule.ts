import { Professional, Schedule } from "@/types";

import { parseISO, format } from 'date-fns';
import { enUS } from 'date-fns/locale';

export const getWeekDay = (date: string) => {
  const day = format(parseISO(date), 'EEEE', { locale: enUS }).toLowerCase();
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