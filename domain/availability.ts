//appointment

import { Appointment, Professional } from "@/types";

//recibo un horario y lo estandarizo a minutos
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

//me sirve para comparar el rango del turno con la disponibilidad
const isTimeInRange = (time: string, from: string, to: string): boolean => {
  const t_min = timeToMinutes(time);
  return t_min >= timeToMinutes(from) && t_min <= timeToMinutes(to);
};

const getWeekDay = (date: string) => {
  const day = new Date(date + 'T00:00:00').toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  return day
};

export const isProfessionalEnabled = (professional: Professional) => {
  return professional.enabled
}

export const hasAbsenceOnDate = (professional: Professional, date: string) => {
  return professional.absences.some((absence) => absence.date === date);
}

export const isWithInWorkingHours = (prof: Professional, date: string, from: string, to: string): boolean => {
  const day = getWeekDay(date);
  //pregunto si esta disp ese dia
  const schedulesForDay = prof.schedules.filter((schedule) => schedule.day === day);
  if (schedulesForDay.length === 0) return false;
  //si está disp entonces comparo los horarios
  const isAvailableHours = schedulesForDay.some((schedule) => {
    return (isTimeInRange(from, schedule.from, schedule.to) && isTimeInRange(to, schedule.from, schedule.to))
  });
  return isAvailableHours;
};

export const isTimeSlotFree = (profId: string, date: string, from: string, to: string, appointments: Appointment[]): boolean => {
  const fromMin = timeToMinutes(from);
  const toMin = timeToMinutes(to);

  //tengo que mostrar turnos libres a traves de los que ya estan ocupados
  const isFree = !appointments.some((appointment) => {
    if (profId !== appointment.professional_id || date !== appointment.date) {
      return false
    }
    //checkeo que no se pisen turnos
    const appFrom = timeToMinutes(appointment.from);
    const appTo = timeToMinutes(appointment.to);

    return fromMin < appTo && toMin > appFrom;
  });

  return isFree
};

export const isProfessionalAvailable = (prof: Professional, appointments: Appointment[], date: string, from: string, to: string): boolean => {
  if (!isProfessionalEnabled(prof)) return false;
  if (hasAbsenceOnDate(prof, date)) return false;
  if (!isWithInWorkingHours(prof, date, from, to)) return false;
  return isTimeSlotFree(prof.id, date, from, to, appointments)
}

export type SlotStatus = "available" | "occupied" | "unavailable";

export const getSlotStatus = (prof: Professional, appointments: Appointment[], date: string, from: string, to: string): SlotStatus => {
  if (!isProfessionalEnabled(prof)) {
    return "unavailable";
  }
  const isFree = isTimeSlotFree(prof.id, date, from, to, appointments);
  if (!isFree) return 'occupied';

  return 'available'
}