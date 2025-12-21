import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useProfessionalStore } from './professional.store';
import { Professional } from '@/types';

export const useFilteredProfessionals = (): Professional[] => {
  const professionals = useProfessionalStore(useShallow(state => state.professionals));
  const nameFilter = useProfessionalStore(state => state.nameFilter);
  const showEnabled = useProfessionalStore(state => state.showEnabled);

  return useMemo(() => {
    return professionals.filter((prof) => {
      const matchesName = nameFilter
        ? prof.name.toLowerCase().includes(nameFilter.toLowerCase().trim())
        : true;

      const matchesStatus = showEnabled ? prof.enabled : true;

      return matchesName && matchesStatus;
    });
  }, [professionals, nameFilter, showEnabled]);
};
