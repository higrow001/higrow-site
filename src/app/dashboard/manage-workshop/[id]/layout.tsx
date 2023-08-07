"use client"
import Navbar from "@/components/navbar/navbar"
import { Button } from "@/components/ui/button"
import { useAlert } from "@/states/alert"
import { ChevronLeft, Copy } from "lucide-react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

export default function Layout({ children }: { children: React.ReactNode }) {
  const { showAutoCloseAlert } = useAlert()
  const pathname = usePathname()
  const params = useParams()

  return (
    <>
      <Navbar />
      <main className="max-w-5xl w-full py-24 mx-auto">
        <div className="flex justify-between items-center mb-20 px-4 md:px-0">
          <Link href="/dashboard/admin" className="flex space-x-1 items-center">
            <Button className="text-base px-0 md:px-4" variant={"ghost"}>
              <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 mr-2" />
              <span>Dashboard</span>
            </Button>
          </Link>
          <Button
            onClick={() => {
              try {
                navigator.clipboard.writeText(
                  `${location.origin}/workshop/${params.id}`
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
            className="py-5"
            variant={"outline"}
            size={"sm"}
          >
            <Copy className="w-4 h-4 md:w-5 md:h-5 mr-2" /> Copy Link
          </Button>
        </div>
        <div className="space-y-12">
          <div className="flex justify-between gap-5 items-center px-8 overflow-x-auto lg:px-16 border-t border-b md:border border-black py-3 md:rounded-md md:shadow-[4px_4px_0_#333] bg-[#fff] snap-x snap-mandatory">
            <Link
              href={`/dashboard/manage-workshop/${params.id}/announcements`}
              className="flex-grow"
            >
              <Button
                className="text-sm md:text-base w-full"
                variant={
                  pathname.includes("announcements") ? "secondary" : "ghost"
                }
                size={"lg"}
              >
                Announcements
              </Button>
            </Link>
            <Link
              href={`/dashboard/manage-workshop/${params.id}/participants`}
              className="flex-grow"
            >
              <Button
                className="w-full text-sm md:text-base"
                variant={
                  pathname.includes("participants") ? "secondary" : "ghost"
                }
                size={"lg"}
              >
                 Participants
              </Button>
            </Link>
          </div>
          {children}
        </div>
      </main>
    </>
  )
}
