import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useProfessionalStore } from '../store/professional.store';
import { Professional } from '@/types';
import { isWorkOnDay } from '@/domain/availability';

export const useFilteredProfessionals = (day: string): Professional[] => {
  const professionals = useProfessionalStore(useShallow(state => state.professionals));
  const nameFilter = useProfessionalStore(state => state.nameFilter);
  const showEnabled = useProfessionalStore(state => state.showEnabled);

  return useMemo(() => {
    return professionals.filter((prof) => {
      const matchesName = nameFilter
        ? prof.name.toLowerCase().includes(nameFilter.toLowerCase().trim())
        : true;

      const matchesStatus = showEnabled ? prof.enabled : true;

      const matchesWorkDay = showEnabled ? isWorkOnDay(prof, day) : true

      return matchesName && matchesStatus && matchesWorkDay;
    });
  }, [professionals, nameFilter, showEnabled, day]);
};
