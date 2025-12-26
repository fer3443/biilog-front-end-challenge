import { isProfessionalAvailable } from "@/domain/availability";
import { Appointment, Professional } from "@/types";
import { create, type StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AppointmentState {
  appointments: Appointment[];

  createAppointment: (prof: Professional, app: Appointment) => boolean;
  updateAppointment: (app: Appointment) => void;
  deleteAppointment: (appointmentId: string) => void;
  applyAppointmentUpdate: (appointment: Appointment) => void;
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
    if (!isAvailable) return false;
    set((state) => ({ appointments: [...state.appointments, appointment] }))
    return true;
  },
  updateAppointment: (appointment: Appointment) => {
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === appointment.id ? appointment : a
      ),
    }))
  },
  deleteAppointment: (appointmentId: string) => {
    const update = get().appointments.filter((app) => app.id !== appointmentId);
    set({ appointments: update })
  },
  applyAppointmentUpdate: (appointment) => set((state) => ({
    appointments: state.appointments.map((a) => a.id === appointment.id ? appointment : a)
  }))
});


export const useAppointmentStore = create<AppointmentState>()(
  devtools(
    persist(
      appointmentStore,
      { name: 'appointment-storage' }
    )
  )
)