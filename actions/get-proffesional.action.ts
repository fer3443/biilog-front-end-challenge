"use server"

import { unstable_noStore as noStore } from "next/cache";
import { AxiosError } from "axios";

// import { professionalApi } from "@/service/professionalApi"
import { Professionals } from "@/types";
import { ProfessionalResponseSchema } from "@/validators/proffesional.schema";

export const getProffesionalAction = async () => {
  // noStore()
  // try {
  //   const resp = await professionalApi.get<Professionals>('professionals');
  //   const parsed = ProfessionalResponseSchema.safeParse(resp.data);
  //   if (!parsed.success) {
  //     console.error(parsed.error.issues)
  //     throw new Error('Error en la respuesta de la Api')
  //   }
  //   return parsed.data

  // } catch (error) {
  //   if (error instanceof AxiosError) {
  //     throw new Error(`${error.response?.status}`)
  //   }
  //   throw new Error('Internal server error')
  // }
  return []
}