import { getNotifications } from "@/app/_actions/notification"
import { getUserOrganizedWorkshops } from "@/app/_actions/workshop"
import Notifications from "@/components/dashboard/notifications"
import { formatDateInDDMMYYYY } from "@/lib/utils/format-date"
import Link from "next/link"

export const revalidate = 60

async function Organized() {
  const workshops = await getUserOrganizedWorkshops()
  const notifications = await getNotifications()
  return (
    <>
      <div className="flex w-full justify-between items-center pt-4 pb-8 px-8 lg:p-20 border-b border-[#333]">
        <h1 className="font-archivo font-medium text-[#333] text-2xl lg:text-4xl">
          Welcome to HiGrow. Dashboard.
        </h1>
        <Notifications notifications={notifications} />
      </div>
      <div className="py-12 px-8 lg:px-20">
        <div className="space-y-8">
          <h1 className="md:text-3xl text-xl font-archivo text-secondary">
            Organized Opportunities
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
            {!!workshops.length ?
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
                    {workshop.is_paid ? workshop.participants.length > 0 ? (
                      <span className="block text-secondary md:text-lg font-semibold">
                        {workshop.participants.length} User{workshop.participants.length > 1 ? "s" : ""} partcipanted
                      </span>
                    ) : (
                      <span className="block text-secondary-lighter md:text-lg font-semibold">
                        No participants
                      </span>
                    ) : workshop.requested_participants.length > 0 ? (
                      <span className="block text-secondary md:text-lg font-semibold">
                        {workshop.requested_participants.length} Pending request{workshop.requested_participants.length > 1 ? "s" : ""}.
                      </span>
                    ) : (
                      <span className="block text-secondary-lighter md:text-lg font-semibold">
                        No participant request to accept
                      </span>
                    )}
                  </div>
                </Link>
              )) : (
                <h2 className="md:text-xl text-base">Your organized workshops will appear here.</h2>
              )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Organized
