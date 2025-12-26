import { Professionals } from "@/types";
import { create, type StateCreator } from "zustand";

interface ProfessionalState {
  professionals: Professionals;

  loading: boolean;
  error: string | null;
  nameFilter: string;
  showEnabled: boolean;

  setProfessionals: (data: Professionals) => void;
  setError: (message: string) => void;
  setNameFilter: (name: string) => void;
  toggleEnabled: () => void;
};

const storeApi: StateCreator<ProfessionalState> = (set) => ({
  professionals: [],

  nameFilter: "",
  showEnabled: false,
  loading: true,
  error: null,

  setProfessionals: (data: Professionals) => set({ professionals: data, error: null, loading: false }),
  setError: (message: string) => set({ error: message, loading: false }),
  setNameFilter: (name: string) => set({ nameFilter: name }),
  toggleEnabled: () => set((state) => ({ showEnabled: !state.showEnabled }))
});



export const useProfessionalStore = create<ProfessionalState>()(storeApi);