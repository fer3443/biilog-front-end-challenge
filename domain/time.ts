import { addMinutesToTime } from "@/utils/add-minutes-to-time";

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