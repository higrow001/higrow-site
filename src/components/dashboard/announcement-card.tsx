"use client"
import { Announcement } from "@/lib/types";
import { XCircle } from "lucide-react";
import { Button } from "../ui/button";
import { formatDateInDDMMYYYY } from "@/lib/utils/format-date";
import { useTransition } from "react";
import { deleteAnnouncement } from "@/app/_actions/workshop";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

export default function AnnouncementCards({ announcements, workshop_id }: { announcements: Announcement[]; workshop_id: string }) {
  const [isPending, startTransition] = useTransition()
  return (
    <div className="w-full space-y-4">
      {isPending ? (
        <Skeleton className="w-full h-80" />
      ) : announcements.map((ann, index) => (
        <div
          key={index}
          className="py-6 px-8 md:py-10 md:px-16 space-y-6 border-t border-b md:border-2 border-[#333] md:rounded-md bg-background"
        >
          <div className="flex items-center justify-between w-full">
            <h3 className="text-xl md:text-3xl font-semibold font-archivo">
              {ann.title} <span className="text-xs ml-3 md:ml-6 tracking-wider md:text-base font-light">
                {formatDateInDDMMYYYY(ann.timestamp, false)}
              </span>
            </h3>
            
            <div className="flex space-x-4 items-center">
              
              <button
                onClick={() => startTransition(async () => {
                  await deleteAnnouncement(announcements, workshop_id, ann.timestamp)
                })}
                className="flex items-center justify-between w-full"
              >
               <span className="align-center text-xs md:text-base text-[#FE0000]"> Delete </span>
              </button>
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
