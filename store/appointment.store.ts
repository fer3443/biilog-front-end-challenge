import { isProfessionalAvailable } from "@/domain/availability";
import { Appointment, Professional } from "@/types";
import { create, type StateCreator } from "zustand";
import { persist } from "zustand/middleware";

interface AppointmentState {
  appointments: Appointment[];

  createAppointment: (prof: Professional, app: Appointment) => boolean;
  updateAppointment: (prof: Professional, app: Appointment) => boolean;
  deleteAppointment: (appointmentId: string) => void;
}

const appointmentStore: StateCreator<AppointmentState> = (set, get) => ({
  appointments: [],

  createAppointment: (professional: Professional, appointment: Appointment) => {
    const appointments = get().appointments;
    const isAvailable = isProfessionalAvailable(
      professional,
      appointments,
      appointment.date,
      appointment.from,
      appointment.to
    );
    console.log(isAvailable, "desde zustand")
    if (!isAvailable) return false;
    set((state) => ({ appointments: [...state.appointments, appointment] }))
    return true;
  },
  updateAppointment: (professional: Professional, appointment: Appointment) => {
    const appointments = get().appointments;
    const othersAppointments = appointments.filter((app) => app.id !== appointment.id);

    const isAvailable = isProfessionalAvailable(
      professional,
      othersAppointments,
      appointment.date,
      appointment.from,
      appointment.to
    );

    if (!isAvailable) return false;
    set({ appointments: [...othersAppointments, appointment] });
    return true;
  },
  deleteAppointment: (appointmentId: string) => {
    const update = get().appointments.filter((app) => app.id !== appointmentId);
    set({ appointments: update })
  }
});


export const useAppointmentStore = create<AppointmentState>()(
  persist(
    appointmentStore,
    { name: 'appointment-storage' }
  )
)