"use client"

import React from "react";
import { useProfessionalStore } from "@/store/professional.store";
import { Professionals } from "@/types";
import { CalendarView } from "./CalendarView";
import { LoadingComponent } from "@/components/ui/loading-component";

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

  if (isLoading) {
    return <LoadingComponent />
  }
  return (
    <CalendarView />
  )
}
