"use client"

import { Professionals } from "@/types";

interface Props {
  professionals: Professionals;
}

export const HomeView = ({ professionals }: Props) => {
  if (!professionals.length) {
    return (
      <div>No se pudieron cargar turnos</div>
    )
  }

  return (
    <div>
      {professionals.map((prof) => (
        <p key={prof.id}>{prof.name}</p>
      ))}
    </div>
  )
}
