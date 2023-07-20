"use client"
import Navbar from "@/components/navbar/navbar"
import { Button } from "@/components/ui/button"
import { useAlert } from "@/states/alert"
import { ChevronLeft, Copy } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Layout({ children }: { children: React.ReactNode }) {
  const { showAutoCloseAlert } = useAlert()
  const pathname = usePathname()
  const workshop_id = pathname.substring(
    20,
    pathname.includes("announcements")
      ? pathname.indexOf("announcements") - 1
      : pathname.includes("details")
      ? pathname.indexOf("details") - 1
      : pathname.indexOf("socials") - 1
  )

  return (
    <>
      <Navbar />
      <main className="max-w-4xl w-full py-24 mx-auto">
        <div className="flex justify-between items-center mb-20">
          <Link
            href="/dashboard/enrolled"
            className="flex space-x-1 items-center"
          >
            <Button className="text-base" variant={"ghost"}>
              <ChevronLeft className="w-6 h-6 mr-2" />
              <span>Dashboard</span>
            </Button>
          </Link>
          <Button
            onClick={() => {
              try {
                navigator.clipboard.writeText(
                  `${location.origin}/workshop/${workshop_id}`
                )
                showAutoCloseAlert({
                  title: "Link copied in your clipboard.",
                  type: "default",
                })
              } catch (error) {
                showAutoCloseAlert({
                  title: "Can't copy link in your clipboard.",
                  type: "destructive",
                })
              }
            }}
            variant={"secondary"}
          >
            <Copy className="w-5 h-5 mr-2" /> Share Public Link
          </Button>
        </div>
        <div className="space-y-12">
          <div className="flex justify-between gap-10 items-center px-20 border border-black py-3 rounded-md shadow-[4px_4px_0_#333] bg-background">
            <Link
              href={`/dashboard/workshop/${workshop_id}/announcements`}
              className="flex-grow"
            >
              <Button
                className="text-base w-full"
                variant={
                  pathname.includes("announcements") ? "secondary" : "ghost"
                }
                size={"lg"}
              >
                Announcements
              </Button>
            </Link>
            <Link
              href={`/dashboard/workshop/${workshop_id}/details`}
              className="flex-grow"
            >
              <Button
                className="w-full text-base"
                variant={pathname.includes("details") ? "secondary" : "ghost"}
                size={"lg"}
              >
                Overview
              </Button>
            </Link>
            <Link
              href={`/dashboard/workshop/${workshop_id}/socials`}
              className="flex-grow"
            >
              <Button
                className="w-full text-base"
                variant={pathname.includes("socials") ? "secondary" : "ghost"}
                size={"lg"}
              >
                Contact Organizer
              </Button>
            </Link>
          </div>
          {children}
        </div>
      </main>
    </>
  )
}
