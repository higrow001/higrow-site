"use client"
import { requestJoinWorkshop } from "@/app/_actions/workshop"
import { Button } from "../ui/button"
import { useEffect, useState, useTransition } from "react"
import { useAlert } from "@/states/alert"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import LoadingSpinner from "../loading-spinner"

export default function RequestButton({
  id,
  requests,
  participants,
  applicationDate,
}: {
  id: string
  requests: { email: string }[]
  participants: { email: string }[]
  applicationDate: string
}) {
  const supabase = createClientComponentClient()
  const applicationClosingDate = new Date(applicationDate)
  const currentDate = new Date()
  const timeExpired = applicationClosingDate < currentDate
  const { showAlert } = useAlert()
  const [isRequested, setIsRequested] = useState(false)
  const [isAccepted, setIsAccepted] = useState(false)
  const [requestedSent, setRequesteSent] = useState(false)
  const [isPending, startTransition] = useTransition()

  const checkUpdates = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    setIsRequested(
      requests.findIndex((req) => req.email === session?.user.email) > -1
    )
    setIsAccepted(
      participants.findIndex((req) => req.email === session?.user.email) > -1
    )
  }

  useEffect(() => {
    checkUpdates()
  }, [supabase.auth])

  return (
    <Button
      disabled={isRequested || timeExpired || requestedSent || isAccepted}
      className="w-full text-sm  md:text-base"
      size={"xl"}
      variant={"secondary"}
      onClick={() => {
        startTransition(async () => {
          await requestJoinWorkshop(id)
          setRequesteSent(true)
          showAlert({
            title: "Success",
            type: "default",
            description:
              "Request sent to organizer. You'll be notified in dashboard if you get accepted.",
            clickClose: { text: "Okay" },
          })
        })
      }}
    >
      {isPending ? (
        <LoadingSpinner sizeStyle="w-5 h-5" />
      ) : isAccepted
        ? "Already Joined"
        : isRequested
          ? "Already Requested"
          : timeExpired
            ? "Registration Closed"
            : "Join Now"}
    </Button>
  )
}
