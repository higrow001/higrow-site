"use client"
import { Announcement } from "@/lib/types";
import { XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { formatDateInDDMMYYYY } from "@/lib/utils/format-date";
import { useTransition } from "react";
import { deleteAnnouncement } from "@/app/_actions/workshop";
import { Skeleton } from "../ui/skeleton";

export default function AnnouncementCards({ announcements, workshop_id }: { announcements: Announcement[]; workshop_id: string }) {
  const [isPending, startTransition] = useTransition()
  return (
    <div className="w-full space-y-4">
      {isPending ? (
        <Skeleton className="w-full h-80" />
      ) : announcements.map((ann, index) => (
        <div
          key={index}
          className="py-10 px-20 space-y-6 border-2 border-[#333] rounded-md bg-background"
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
                onClick={() => startTransition(async () => {
                  await deleteAnnouncement(announcements, workshop_id, ann.timestamp)
                })}
                size={"sm"}
                variant={"secondary"}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
          <div
            className="prose-sm"
            dangerouslySetInnerHTML={{ __html: ann.message }}
          ></div>
        </div>
      ))}
    </div>
  )
}
