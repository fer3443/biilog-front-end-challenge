import { addMinutesToTime } from "@/utils/add-minutes-to-time";

export const generateSlots = (from: string, to: string, interval = 30) => {
  const slots = [];
  let current = from;

  while (current < to) {
    const next = addMinutesToTime(current, interval);
    if (next > to) break;

    slots.push({ from: current, to: next });
    current = next;
  }
  return slots
}