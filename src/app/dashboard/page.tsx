"use client"
import OrganizedWorkshops from "@/components/dashboard/org-workshops"

export default function Dashboard() {
  return (
    <main className="basis-[80%]">
      <h1 className="font-archivo font-medium text-[#333] text-4xl p-20 border-b border-[#333]">
        Dashboard {">"} Organized Opportunities
      </h1>
      <div className="py-12 px-20">
        <OrganizedWorkshops />
      </div>
    </main>
  )
}
