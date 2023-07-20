"use client"
import MakeAnnoucement from "@/components/dashboard/announcement-modal"
import AnnouncementSkeleton from "@/components/skeletons/workshop-announcements"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { db } from "@/lib/firebase"
import { Announcement, TimestampType } from "@/lib/types"
import { formatDateInDDMMYYYY } from "@/lib/utils/format-date"
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore"
import { XCircle } from "lucide-react"
import { useEffect, useState } from "react"

export default function Announcements({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [announcements, setAnnouncements] = useState<
    {
      id: string
      title: string
      message: string
      timestamp: TimestampType
    }[]
  >([])
  async function getAnnouncements() {
    let anns: Announcement[] = []
    const fetchData = await getDocs(
      query(
        collection(db, "workshops", params.id, "announcements"),
        orderBy("timestamp", "desc")
      )
    )
    if (!fetchData.empty) {
      fetchData.forEach((doc) => {
        anns.push({
          id: doc.id,
          timestamp: doc.data().timestamp,
          title: doc.data().title,
          message: doc.data().message,
        })
      })
    }
    setAnnouncements(anns)
    setIsLoading(false)
  }
  useEffect(() => {
    getAnnouncements()
    const unsub = onSnapshot(
      query(
        collection(db, "workshops", params.id, "announcements"),
        orderBy("timestamp", "desc")
      ),
      (docs) => {
        let anns: Announcement[] = []
        if (!docs.empty) {
          docs.forEach((doc) => {
            anns.push({
              id: doc.id,
              timestamp: doc.data().timestamp,
              title: doc.data().title,
              message: doc.data().message,
            })
          })
        }
        setAnnouncements(anns)
      }
    )
    return () => {
      unsub()
    }
  }, [])
  return (
    <>
      {isLoading ? (
        <AnnouncementSkeleton />
      ) : (
        <>
          {announcements.length > 0 ? (
            <div className="w-full space-y-4">
              <MakeAnnoucement workshop_id={params.id} />
              {announcements.map((ann) => (
                <div
                  key={ann.id}
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
                          await deleteDoc(
                            doc(
                              db,
                              "workshops",
                              params.id,
                              "announcements",
                              ann.id
                            )
                          )
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
            <>
              <MakeAnnoucement workshop_id={params.id} />
              <p className="text-center text-xl">
                No announcments posted till now.
              </p>
            </>
          )}
        </>
      )}
    </>
  )
}
