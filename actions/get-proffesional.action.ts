"use server"

import { professionalApi } from "@/service/professionalApi"
import { Professionals } from "@/types";

export const getProffesionalAction = async (): Promise<Professionals> => {
  const { data } = await professionalApi.get<Professionals>('professionals');
  return data
}