export interface Slot {
  date: string;
  from: string;
  to: string;
}

export type SlotStatus = "available" | "busy" | "disabled";