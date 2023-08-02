"use client"
import { useState, useTransition } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Bell, Check, Loader2 } from "lucide-react"
import { ScrollArea } from "../ui/scroll-area"
import { NotificationData, NotificationType } from "@/lib/types"
import markAllNotificationsRead from "@/app/_actions/notification"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

export default function Notifications({
  notifications,
}: {
  notifications: NotificationType
}) {
  const [open, setOpen] = useState(false)
  let [isPending, startTransition] = useTransition()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role="combobox"
          aria-expanded={open}
          size={"icon"}
          className="shrink-0 md:h-12 md:w-12 md:hover:bg-background/50 relative"
        >
          {!!notifications.workshop_new.length && <div className="w-2 h-2 absolute top-2 right-2 bg-red-500 rounded-full"></div>}
          <Bell className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[250px] md:w-[350px] p-0">
        <Button
          className="w-full bg-secondary rounded-b-none rounded-t-md hover:bg-secondary-lighter"
          size={"lg"}
          onClick={() => startTransition(async () => {
            await markAllNotificationsRead()
          })}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Check className="w-5 h-5 mr-2" />
              Mark all as read
            </>
          )}
        </Button>
        <ScrollArea className="w-full h-[400px] md:h-[500px]">
          {!!notifications.workshop_new.length || !!notifications.workshop_readed.length ?
            <div className="divide-y divide-secondary-lighter">
              {notifications.workshop_new.map((notification) => (
                <>
                  {notification.redirect_path ? (
                    <Link href={notification.redirect_path} key={notification.id} className="space-y-1 p-4 block">
                      <h3 className="text-sm md:text-base font-semibold">
                        {notification.title.includes("%NUMBER_VALUE%") ? notification.title.replace("%NUMBER_VALUE%", notification.number_value!.toString()) : notification.title}
                      </h3>
                      <p className="text-secondary text-xs sm:text-sm">
                        {formatDistanceToNow(new Date(notification.timestamp)) + " ago"}
                      </p>
                    </Link>
                  ) : (
                    <div key={notification.id} className="space-y-1 p-4 block">
                      <h3 className="text-sm md:text-base font-semibold">
                        {notification.title.includes("%NUMBER_VALUE%") ? notification.title.replace("%NUMBER_VALUE%", notification.number_value!.toString()) : notification.title}
                      </h3>
                      <p className="text-secondary text-xs sm:text-sm">
                        {formatDistanceToNow(new Date(notification.timestamp)) + " ago"}
                      </p>
                    </div>
                  )}
                </>
              ))}
              {notifications.workshop_readed.map((notification) => (
                <div key={notification.id} className="space-y-1 p-4 bg-neutral-200">
                  <h3 className="text-sm md:text-base font-semibold text-secondary-lighter">
                    {notification.title.includes("%NUMBER_VALUE%") ? notification.title.replace("%NUMBER_VALUE%", notification.number_value!.toString()) : notification.title}
                  </h3>
                  <p className="text-secondary-lighter text-xs sm:text-sm">
                    {formatDistanceToNow(new Date(notification.timestamp)) + " ago"}
                  </p>
                </div>
              ))}
            </div>
            : (
              <p className="text-sm md:text-base m-4">No notification to see right now.</p>
            )}
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
