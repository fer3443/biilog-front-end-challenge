import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";

interface DragState {
  dragginAppointmentId: string | undefined;

  setDragginAppointmentId: (appointmentId: string) => void;
  removeDragginAppointmentId: () => void;
}

const storeDrag: StateCreator<DragState> = (set) => ({
  dragginAppointmentId: undefined,

  setDragginAppointmentId: (appointmentId) => set({ dragginAppointmentId: appointmentId }),
  removeDragginAppointmentId: () => set({ dragginAppointmentId: undefined })
});

export const useDragStore = create<DragState>()(
  devtools(
    storeDrag
  )
)