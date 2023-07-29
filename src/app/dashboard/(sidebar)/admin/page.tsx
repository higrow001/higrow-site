import { getUserOrganizedWorkshops } from "@/app/_actions/workshop"
import { formatDateInDDMMYYYY } from "@/lib/utils/format-date"
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
            {workshops &&
              workshops.map((workshop, index) => (
                <Link
                  className="lg:px-12 md:px-8 px-6 py-4 md:py-6 block bg-background rounded-lg border border-secondary"
                  href={`/dashboard/manage-workshop/${workshop.id}/announcements`}
                  key={index}
                >
                  <div className="flex flex-col justify-between space-y-8 h-full">
                    <div className="space-y-2">
                      <h2 className="md:text-2xl text-xl font-medium">
                        {workshop.name}
                      </h2>
                      <span className="text-secondary text-sm md:text-base block">
                        {formatDateInDDMMYYYY(workshop.workshop_starting_date) +
                          " - " +
                          formatDateInDDMMYYYY(workshop.workshop_ending_date)}
                      </span>
                      <span className="block text-primary md:text-lg font-semibold">
                        Accepting applications
                      </span>
                    </div>
                    <span className="block text-secondary-lighter md:text-lg font-semibold">
                      No new Announcments
                    </span>
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
