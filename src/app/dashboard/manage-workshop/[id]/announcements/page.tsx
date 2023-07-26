"use client"
import AnnouncementSkeleton from "@/components/skeletons/workshop-announcements"
import { Button } from "@/components/ui/button"
import { Announcement } from "@/lib/types"
import { formatDateInDDMMYYYY } from "@/lib/utils/format-date"
import { XCircle } from "lucide-react"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"
import { getAnnouncements } from "@/app/_actions/workshop"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { RealtimeChannel } from "@supabase/supabase-js"
import { useAlert } from "@/states/alert"
const MakeAnnoucement = dynamic(
  () => import("@/components/dashboard/announcement-modal"),
  { ssr: false, loading: () => <Skeleton className="w-full h-16" /> }
)

export default function Announcements({ params }: { params: { id: string } }) {
  const { showAlert } = useAlert()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(true)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  async function getData() {
    const fetchData = await getAnnouncements(params.id)
    setAnnouncements(fetchData)
    setIsLoading(false)
  }
  useEffect(() => {
    getData()
    let unsub: RealtimeChannel
    try {
      unsub = supabase
        .channel("db_table_changes")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "workshops",
            filter: `id=eq.${params.id}`,
          },
          (payload) => {
            setAnnouncements(payload.new.announcements)
          }
        )
        .subscribe()
    } catch (error) {
      showAlert({
        title: "Realtime updates not available.",
        description:
          "You will not get the UI updates when you create or delete an annoncements. Just refresh the page after clicking button to make sure it updated.",
        type: "destructive",
      })
    }
    return () => {
      unsub.unsubscribe()
    }
  }, [])
  return (
    <>
      {isLoading ? (
        <AnnouncementSkeleton />
      ) : (
        <>
          <MakeAnnoucement
            announcements={announcements}
            workshop_id={params.id}
          />
          {announcements.length > 0 ? (
            <div className="w-full space-y-4">
              {announcements.map((ann, index) => (
                <div
                  key={index}
                  className="py-10 px-24 space-y-6 border-2 border-[#333] rounded-md shadow-[2px_2px_0_#333] bg-background"
                >
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-3xl font-semibold font-archivo">
                      {ann.title}
                    </h3>
                    <div className="flex space-x-4 items-center">
                      <span className="font-medium">
                        {formatDateInDDMMYYYY(ann.timestamp, true)}
                      </span>
                      <Button
                        onClick={async () => {
                          const newAnnouncements = announcements.filter(
                            (anns) => anns.timestamp !== ann.timestamp
                          )
                          await supabase
                            .from("workshops")
                            .update({
                              announcements: newAnnouncements,
                            })
                            .eq("id", params.id)
                        }}
                        size={"sm"}
                        variant={"secondary"}
                      >
                        <XCircle className="h-5 w-5 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div
                    className="prose-sm prose-h1:text-2xl prose-h2:text-lg"
                    dangerouslySetInnerHTML={{ __html: ann.message }}
                  ></div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-xl">
              No announcments posted till now.
            </p>
          )}
        </>
      )}
    </>
  )
}
