"use client"

import React from "react";
import { ProfessionalFilters } from "@/components/filters/ProfessionalFilters";
import { useProfessionalStore } from "@/store/professional.store";
import { Professionals } from "@/types";
import { CalendarDay } from "@/components/calendar/CalendarDay";

interface Props {
  professionals: Professionals;
}

export const HomeView = ({ professionals }: Props) => {
  const setProfessionals = useProfessionalStore(state => state.setProfessionals);
  const isLoading = useProfessionalStore(state => state.loading);

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
      <div className="col-span-full">
        <CalendarDay />
      </div>
    </div>
  )
}
