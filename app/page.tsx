import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Bilog Challenge",
  description: "Frontend challenge based on a medical schedule"
}
export default async function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-200 flex flex-col items-center justify-center">
      <h1 className="text-4xl text-black">Bilog Frontend Challenge</h1>
    </div>
  )
}
