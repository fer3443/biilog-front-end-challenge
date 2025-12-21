import { getProffesionalAction } from "@/actions/get-proffesional.action"
import { Professionals } from "@/types";
import { HomeView } from "@/views/Home.view"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Bilog Challenge",
  description: "Frontend challenge based on a medical schedule"
}
export default async function Home() {
  const professionals = await getProffesionalAction();  // console.log(professionals)
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-200 p-4">
      <h1 className="text-2xl text-black">Bilog Frontend Challenge</h1>
      <HomeView professionals={professionals as Professionals} />
    </div>
  )
}
