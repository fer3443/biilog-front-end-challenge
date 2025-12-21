"use client";

import { Input } from '../ui/input';
import { useProfessionalStore } from '@/store/professional.store';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { IoSearch } from "react-icons/io5";

export const ProfessionalFilters = () => {
  const nameFilter = useProfessionalStore(state => state.nameFilter);
  const setNameFilter = useProfessionalStore(state => state.setNameFilter);
  const showEnabled = useProfessionalStore(state => state.showEnabled);
  const toggleEnabled = useProfessionalStore(state => state.toggleEnabled);

  return (
    <div className='w-full flex items-center justify-end gap-4'>
      <div className='flex items-center gap-2'>
        <Switch
          id="enabled-filter"
          checked={showEnabled}
          onCheckedChange={toggleEnabled}
        />
        <Label htmlFor='enabled-filter'>Mostrar profesionales activos</Label>
      </div>
      <div className='flex items-center relative'>
        <Input
          className='min-w-lg rounded-xl'
          placeholder='Buscar profesional'
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <span className='absolute right-4'><IoSearch /></span>
      </div>
    </div>
  )
}
