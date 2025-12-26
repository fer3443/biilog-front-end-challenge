import { addMinutesToTime } from "@/utils/add-minutes-to-time";
import { isBefore, parse } from "date-fns";

//recibo un horario y lo estandarizo a minutos
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

//me sirve para comparar el rango del turno con la disponibilidad
export const isTimeInRange = (time: string, from: string, to: string): boolean => {
  const t_min = timeToMinutes(time);
  return t_min >= timeToMinutes(from) && t_min <= timeToMinutes(to);
};

export const calculateTime = (from: string, duration: number): string => {
  return addMinutesToTime(from, duration)
}


export function parseDateTime(date: string, time: string): Date {
  return parse(
    `${date} ${time}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );
}

export function isInThePast(date: string, from: string): boolean {
  const slotDateTime = parseDateTime(date, from);
  const now = new Date();

  return isBefore(slotDateTime, now);
}
