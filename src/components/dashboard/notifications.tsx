"use client"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Bell, Check } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"
import { NotificationData, NotificationType } from "@/lib/types"

export default function Notifications({
  notifications,
}: {
  notifications: NotificationType
}) {
  const [open, setOpen] = useState(false)
  console.log(notifications)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role="combobox"
          aria-expanded={open}
          size={"icon"}
          className="shrink-0 md:h-12 md:w-12 md:hover:bg-background/50"
        >
          <Bell className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[250px] md:w-[300px] p-0">
        <Button className="w-full bg-secondary rounded-b-none rounded-t-md hover:bg-secondary-lighter">
          <Check className="w-5 h-5 mr-2" />
          Mark all as read
        </Button>
        <ScrollArea className="w-full h-[400px] md:h-[500px]">
          <div className="divide-y divide-secondary-lighter">
            <div className="space-y-1 p-4">
              <h3 className="text-sm md:text-base font-semibold">
                You have been accepted to "Coding Workshop".
              </h3>
              <p className="text-secondary text-xs sm:text-sm">2 hours ago</p>
            </div>
            <div className="space-y-1 p-4">
              <h3 className="text-sm md:text-base font-semibold">
                Your submitted Workshop is declined to post.
              </h3>
              <p className="text-secondary text-xs sm:text-sm">5 hours ago</p>
            </div>
            <div className="space-y-1 p-4">
              <h3 className="text-sm md:text-base font-semibold">
                8 new users joined your "Coding Workshop"
              </h3>
              <p className="text-secondary text-xs sm:text-sm">8 hours ago</p>
            </div>
            <div className="space-y-1 p-4">
              <h3 className="text-sm md:text-base font-semibold">
                8 new users joined your "Coding Workshop"
              </h3>
              <p className="text-secondary text-xs sm:text-sm">8 hours ago</p>
            </div>
            <div className="space-y-1 p-4">
              <h3 className="text-sm md:text-base font-semibold">
                8 new users joined your "Coding Workshop"
              </h3>
              <p className="text-secondary text-xs sm:text-sm">8 hours ago</p>
            </div>
            <div className="space-y-1 p-4">
              <h3 className="text-sm md:text-base font-semibold">
                8 new users joined your "Coding Workshop"
              </h3>
              <p className="text-secondary text-xs sm:text-sm">8 hours ago</p>
            </div>
          </div>
        </ScrollArea>
        <Button className="w-full bg-muted md:hover:bg-muted-darker text-black rounded-b-md rounded-t-none">
          View all
        </Button>
      </PopoverContent>
    </Popover>
  )
}

function NotificationCell(notification?: NotificationData) {
  return null
}
