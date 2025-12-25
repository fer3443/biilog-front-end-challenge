import { Appointment, Professional, Slot } from "@/types";
import { create } from "zustand";

enum CalendarView {
  daily = "daily",
  weekly = "weekly"
}

interface CalendarState {
  calendarView: CalendarView;
  selectedDate: Date;
  appointment: Appointment | undefined;
  selectedProfessional: Professional | null;
  selectedSlot: Slot | null;

  setView: (view: CalendarView) => void;
  setDate: (date: Date) => void;
  setAppointment: (appointment: Appointment | undefined) => void;
  setSelectedProfessional: (prof: Professional) => void;
  setSelectedSlot: (slot: Slot | null) => void;
  goToDailyView: () => void;
  goToWeeklyView: (prof: Professional) => void;
}

export const useCalendarStore = create<CalendarState>()((set) => ({
  calendarView: CalendarView.daily,
  selectedDate: new Date(),
  selectedProfessional: null,
  selectedSlot: null,
  appointment: undefined,

  setView: (view) => set({ calendarView: view }),
  setDate: (date) => set({ selectedDate: date }),
  setAppointment: (appointment) => set({ appointment: appointment }),
  setSelectedProfessional: (prof) => set({ selectedProfessional: prof }),
  setSelectedSlot: (slot) => set({ selectedSlot: slot }),
  goToDailyView: () => set({ calendarView: CalendarView.daily, selectedProfessional: null }),
  goToWeeklyView: (prof) => set({ calendarView: CalendarView.weekly, selectedProfessional: prof })
}))