//appointment

import { Appointment, Professional } from "@/types";
import { calculateTime, isTimeInRange, timeToMinutes } from "./time";
import { getScheduleForDay, getWeekDay } from "./schedule";


export const isProfessionalEnabled = (professional: Professional) => {
  return professional.enabled
}

export const hasAbsenceOnDate = (professional: Professional, date: string) => {
  return professional.absences.some((absence) => absence.date === date);
  // return professional.absences.some((absence) => absence.date <= date)
}

export const isWorkOnDay = (professional: Professional, date: string): boolean => {
  const day = getWeekDay(date);
  return professional.schedules.some((s) => s.day === day)
}

export const isWithInWorkingHours = (prof: Professional, date: string, from: string, to: string): boolean => {
  //pregunto si esta disp ese dia
  const schedulesForDay = getScheduleForDay(prof, date);
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

  if (!isWithInWorkingHours(prof, date, from, to)) {
    return "unavailable"
  }

  const isFree = isTimeSlotFree(prof.id, date, from, to, appointments);
  if (!isFree) return 'occupied';

  return 'available'
}

//medio al pedo
export const isSlotAvailable = (prof: Professional, date: string, from: string, to: string, appointments: Appointment[]): boolean => {
  if (hasAbsenceOnDate(prof, date)) return false;
  return (isWithInWorkingHours(prof, date, from, to) && isTimeSlotFree(prof.id, date, from, to, appointments));
}

export const canRescheduleAppointment = (prof: Professional, app: Appointment, appointments: Appointment[]): boolean => {
  const to = calculateTime(app.from, app.duration)
  const others = appointments.filter(a => a.id !== app.id);
  return isProfessionalAvailable(
    prof,
    others,
    app.date,
    app.from,
    to
  )
}

interface canMoveAppointmentResp {
  canMove: boolean;
  reason?: string;
  updatedAppointment?: Appointment
}

export const canMoveAppointment = (appointment: Appointment, professional: Professional, newDate: string, newFrom: string, appointments: Appointment[]): canMoveAppointmentResp => {

  const newTo = calculateTime(newFrom, appointment.duration);
  if (!isWithInWorkingHours(professional, newDate, newFrom, newTo)) {
    return { canMove: false, reason: "El turno está fuera del horario laboral" }
  }

  if (!isProfessionalEnabled(professional) || hasAbsenceOnDate(professional, newDate)) {
    return { canMove: false, reason: "El profesional no se encuentra disponible" }
  }

  const overlapping = appointments.some((app) => {
    if (app.id === appointment.id) return false;
    if (app.professional_id !== appointment.professional_id) return false;
    if (app.date !== newDate) return false; //agrego esta condicion xq solo le permito cambiar de horario
    return !(app.to <= newFrom || app.from >= newTo)
  })

  if (overlapping) {
    return { canMove: false, reason: "Horario ocupado" }
  }
  // canRescheduleAppointment(professional, { ...appointment, date: newDate, from: newFrom, to: newTo }, appointments)
  return {
    canMove: true,
    updatedAppointment: { ...appointment, updated_at: new Date() }
  }
}