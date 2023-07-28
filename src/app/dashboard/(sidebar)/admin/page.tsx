import { getUserOrganizedWorkshops } from "@/app/_actions/workshop"
import { Button } from "@/components/ui/button"
import { formatDateInDDMMYYYY } from "@/lib/utils/format-date"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

async function Organized() {
  const workshops = await getUserOrganizedWorkshops()

  return (
    <main className="basis-[80%]">
      <h1 className="font-archivo font-medium text-[#333] text-4xl p-20 border-b border-[#333]">
        Welcome to HiGrow. Dashboard.
      </h1>
      <div className="py-12 px-20">
        <div className="space-y-8">
          <div className="flex w-full justify-between items-center">
            <h1 className="text-3xl font-archivo text-secondary">
              Organized Opportunities
            </h1>
            <Link href="/dashboard/all-workshops">
              <Button variant={"outline"}>See All</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {workshops &&
              workshops.map((workshop, index) => (
               <Link
                className="px-4 "
                href={`/dashboard/manage-workshop/${workshop.id}/announcements`}
              >     <div
                  key={index}
                  className="md:flex flex-col md:flex-row w-full py-4 px-4 text-left items-center border border-input bg-background rounded-md  flex-wrap"
                >
                  <h2 className="text-md md:text-lg px-4 w-full mb-2 md:mb-0 md:w-[45%] md:border-r-2 grow-[3] truncate">
                    {workshop.name}
                  </h2>
                  <div className="text-sm md:text-base mb-3 md:mb-0  px-4 w-full md:w-[18%] md:border-r-2 md:text-center shrink-0 tracking-widest">{`${formatDateInDDMMYYYY(
                    workshop.workshop_starting_date
                  )}`}</div>
                  <div className="text-primary-lighter text-sm md:text-base  md:text-center w-full shrink-0 md:w-[30%] grow-[2] font-semibold px-4">
                    Accepting applications
                  </div>
                 
                    <ChevronRight className="text-secondary hidden md:block w-5 h-5 mr-2" />
                  
                </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default Organized
