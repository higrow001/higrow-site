"use client"
import { requestWorkshop } from "@/app/_actions/workshop"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import { useAlert } from "@/states/alert"
import { TimestampType } from "@/lib/types"
import { Timestamp } from "firebase/firestore"

export default function RequestButton({
  id,
  requests,
  participants,
  applicationDate,
}: {
  id: string
  requests: { email: string }[]
  participants: { email: string }[]
  applicationDate: TimestampType
}) {
  const timestamp = new Timestamp(
    applicationDate.seconds,
    applicationDate.nanoseconds
  )
  const applicationClosingDate = new Date(timestamp.toDate())
  const currentDate = new Date()
  const timeExpired = applicationClosingDate < currentDate
  const { showAlert } = useAlert()
  const [isRequested, setIsRequested] = useState(false)
  const [isAccepted, setIsAccepted] = useState(false)
  const [requestedSent, setRequesteSent] = useState(false)
  useEffect(() => {
    const email = document.cookie
      .split("; ")
      .find((row) => row.startsWith("email="))
      ?.split("=")[1]
    setIsRequested(requests.findIndex((req) => req.email === email) > -1)
    setIsAccepted(participants.findIndex((req) => req.email === email) > -1)
  }, [])

  return (
    <Button
      disabled={isRequested || timeExpired || requestedSent || isAccepted}
      className="w-full text-base"
      size={"xl"}
      variant={"secondary"}
      onClick={async () => {
        await requestWorkshop(id)
        setRequesteSent(true)
        showAlert({
          title: "Success",
          type: "default",
          description:
            "Request sent to organizer. You'll be notified in dashboard if you get accepted.",
          clickClose: { text: "Okay" },
        })
      }}
    >
      {isAccepted
        ? "Already Joined"
        : isRequested
        ? "Already Requested"
        : timeExpired
        ? "Registration Closed"
        : "Request Join For Free"}
    </Button>
  )
}
