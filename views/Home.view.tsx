"use client"

import React from "react";
import { ProfessionalFilters } from "@/components/filters/ProfessionalFilters";
import { useProfessionalStore } from "@/store/professional.store";
import { Professionals } from "@/types";
import { CalendarDay } from "@/components/calendar/CalendarDay";
import { TimeSlots } from "@/components/calendar/TimeSlots";

interface Props {
  professionals: Professionals;
}

export const HomeView = ({ professionals }: Props) => {
  const setProfessionals = useProfessionalStore(state => state.setProfessionals);
  const isLoading = useProfessionalStore(state => state.loading);
  const [date, setDate] = React.useState<Date>(new Date())

  React.useEffect(() => {
    if (professionals) {
      setProfessionals(professionals)
    }
  }, [professionals, setProfessionals]);

  //crear un componente de carga
  if (isLoading) {
    return (<div className="h-full flex items-center justify-center"><p className="text-2xl">Cargando...</p></div>)
  }

  return (
    <div className="grid grid-cols-1 mt-4 gap-2">
      <div className="col-span-full">
        <ProfessionalFilters />
      </div>
      <div className="grid grid-cols-12 items-start justify-between gap-4">
        <div className="col-span-3">
          <CalendarDay onDate={setDate} />
        </div>
        <div className="col-span-9">
          <TimeSlots date={date} />
        </div>
      </div>
    </div>
  )
}
