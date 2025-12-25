"use client"

import React from 'react';
import { TimeSlots } from './TimeSlots';
import { ProfessionalFilters } from '../filters/ProfessionalFilters';

export const CalendarDay = () => {
  return (
    <div className="grid grid-cols-12 items-start justify-between gap-4 fade-in">
      <div className='col-span-full'>
        <ProfessionalFilters />
      </div>
      <div className="col-span-full">
        <TimeSlots />
      </div>
    </div>
  )
}
