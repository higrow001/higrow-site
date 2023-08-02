import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"
import { getWorkshop } from "@/app/_actions/workshop"
import AnnouncementCards from "@/components/dashboard/announcement-card"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import checkSession from "@/lib/utils/check-session"
const MakeAnnoucement = dynamic(
  () => import("@/components/dashboard/announcement-modal"),
  { ssr: false, loading: () => <Skeleton className="w-full h-16" /> }
)

export default async function Announcements({ params }: { params: { id: string } }) {
  await checkSession(`/signin?redirect=dashboard/manage-workshop/${params.id}/announcements`)
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  const workshop = await getWorkshop(params.id)
  if (workshop?.created_by !== session?.user.id) redirect("/")
  return (
    <>
      <MakeAnnoucement
        announcements={workshop?.announcements ?? []}
        workshop_id={params.id}
        participants={workshop?.participants ?? []}
        workshop_title={workshop?.name ?? ""}
      />
      {workshop && workshop?.announcements.length > 0 ? (
        <AnnouncementCards workshop_id={params.id} announcements={workshop.announcements} />
      ) : (
        <p className="text-center text-xl">
          No announcments posted till now.
        </p>
      )}
    </>
  )
}
