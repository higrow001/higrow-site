import { getNotifications } from "@/app/_actions/notification"
import { getParticipatedWorkshops } from "@/app/_actions/workshop"
import Notifications from "@/components/dashboard/notifications"
import { formatDateInDDMMYYYY } from "@/lib/utils/format-date"
import Link from "next/link"

export const revalidate = 60

async function EnrolledPage() {
  const workshops = await getParticipatedWorkshops()
  const notifications = await getNotifications()
  return (
    <>
      <div className="flex w-full justify-between items-center pt-4 pb-8 px-8 lg:p-20 border-b border-[#333]">
        <h1 className="font-archivo font-medium text-[#333] text-2xl lg:text-4xl">
          Welcome to HiGrow. Dashboard.
        </h1>
        <Notifications notifications={notifications} />
      </div>
      <div className="py-10 px-8 md:py-12 md:px-20">
        <div className="space-y-8">
          <h1 className="md:text-3xl text-xl font-archivo text-secondary">
            Enrolled Workshops
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
            {!!workshops.length ?
              workshops.map((workshop, index) => (
                <Link
                  className="lg:px-8 md:px-6 px-4 py-4 md:py-6 block bg-background rounded-[4px] border border-secondary hover:shadow-[3px_3px_0_#333]"
                  href={`/dashboard/workshop/${workshop.id}/announcements`}
                  key={index}
                >
                  <div className="flex flex-col justify-between space-y-8 h-full">
                    <div className="space-y-2">
                      <h2 className="md:text-2xl text-xl font-medium">
                        {workshop.name}
                      </h2>
                      <span className="text-secondary text-sm block">
                        {formatDateInDDMMYYYY(workshop.workshop_starting_date) +
                          " - " +
                          formatDateInDDMMYYYY(workshop.workshop_ending_date)}
                      </span>
                      <span className="block text-primary md:text-lg font-semibold">
                        Accepting applications
                      </span>
                    </div>
                    {workshop.announcements.length > 0 ? (
                      <span className="block text-secondary md:text-lg font-semibold">
                        {workshop.announcements.length} Announcement{workshop.announcements.length > 1 ? "s" : ""} Posted
                      </span>
                    ) : (
                      <span className="block text-secondary-lighter md:text-lg font-semibold">
                        No new Announcments
                      </span>
                    )}
                  </div>
                </Link>
              )) : (
                <h2 className="md:text-xl text-base">Your participated workshops will appear here.</h2>
              )}
          </div>
        </div>
      </div>
    </>
  )
}

export default EnrolledPage
