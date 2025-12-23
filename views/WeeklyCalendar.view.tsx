"use client"

import React from 'react';
import { WeeklyNavigator } from '@/components/calendar/WeeklyNavigator';
import { WeeklyCalendar } from '@/components/calendar/WeeklyCalendar';
import { Appointment, Professional, Slot } from '@/types';
import { AppointmentDialog } from '@/components/appointment/AppointmentDialog';

interface Props {
  date: Date;
  professional: Professional;
  appointments: Appointment[];
}

export const WeeklyCalendarView = ({ date, appointments, professional }: Props) => {
  const [baseDate, setBaseDate] = React.useState<Date>(date);
  const [selectedSlot, setSelectedSlot] = React.useState<Slot | null>(null)
  return (
    <>
      <WeeklyNavigator
        baseDate={baseDate}
        onChange={setBaseDate}
      />

      <WeeklyCalendar
        appointments={appointments}
        baseDate={baseDate}
        professional={professional}
        onSelectSlot={setSelectedSlot}
      />
      {selectedSlot && (
        <AppointmentDialog
          open={true}
          onOpen={() => setSelectedSlot(null)}
          professional={professional}
          date={selectedSlot.date}
          from={selectedSlot.from}
          to={selectedSlot.to}
        />
      )}
    </>
  )
}
