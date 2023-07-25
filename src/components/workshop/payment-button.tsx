"use client"

import { Button } from "../ui/button"
import Script from "next/script"
import { useAlert } from "@/states/alert"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Timestamp, arrayUnion, doc, updateDoc } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { TimestampType } from "@/lib/types"
import { joinWorkshop } from "@/app/_actions/workshop"

export interface WorkshopDetails {
  amount: number
  organizerEmail: string
  workshopId: string
  workshopName: string
  applicationDate: TimestampType
  participants: { email: string }[]
}

export default function PaymentButton({
  amount,
  organizerEmail,
  workshopId,
  workshopName,
  applicationDate,
  participants,
  children,
}: WorkshopDetails & { children: React.ReactNode }) {
  const router = useRouter()
  const [isParticipated, setIsParticipated] = useState(false)
  const [email, setEmail] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [userID, setUserID] = useState("")
  const { showAlert } = useAlert()
  const [isLoading, setIsLoading] = useState(false)
  const timestamp = new Timestamp(
    applicationDate.seconds,
    applicationDate.nanoseconds
  )
  const applicationClosingDate = new Date(timestamp.toDate())
  const currentDate = new Date()
  const timeExpired = applicationClosingDate < currentDate

  useEffect(() => {
    if (document) {
      const emailCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("email="))
        ?.split("=")[1]
      const displayNameCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("display_name="))
        ?.split("=")[1]
      const userIDCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("uid="))
        ?.split("=")[1]
      setEmail(emailCookie!)
      setDisplayName(displayNameCookie!)
      setUserID(userIDCookie!)
    }
  }, [])

  useEffect(() => {
    setIsParticipated(
      participants.findIndex((participant) => participant.email === email) > -1
    )
  }, [email])

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Button
        className="w-full text-base"
        size={"xl"}
        variant={"secondary"}
        disabled={isLoading || timeExpired || isParticipated}
        onClick={async () => {
          if (auth.currentUser) {
            setIsLoading(true)
            const data = await fetch("/api/payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                amount,
                organizerEmail,
                workshopId,
                workshopName,
              }),
              cache: "no-store",
            })
            const orderData = await data.json()

            const options = {
              key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
              order_id: orderData.order.id,
              amount: orderData.order.amount_due,
              currency: orderData.order.currency,
              name: "HiGrow",
              description: "Test Transaction",
              image:
                "https://i.pinimg.com/originals/55/de/1c/55de1ca51a58ba79c63c1032d52aa4dd.jpg",
              handler: async function (response: any) {
                setIsLoading(false)
                await updateDoc(doc(db, "workshops", workshopId), {
                  "private.payment_records": arrayUnion({
                    payment_id: response.razorpay_payment_id,
                    order_id: response.razorpay_order_id,
                    signature: response.razorpay_signature,
                  }),
                })
                await updateDoc(doc(db, "users", userID), {
                  participated_workshops: arrayUnion(workshopId),
                })
                await joinWorkshop(workshopId)
              },
              prefill: {
                name: displayName,
                email: email,
              },
              notes: orderData.order.notes,
              theme: {
                color: "#0d45db",
              },
              modal: {
                ondismiss: () => setIsLoading(false),
              },
              config: {
                display: {
                  hide: [
                    {
                      method: "paylater",
                    },
                  ],
                  preferences: {
                    show_default_blocks: true,
                  },
                },
              },
            }
            const rzpWindow = window as any
            const rzp = new rzpWindow.Razorpay(options)
            rzp.open()
            rzp.on("payment.failed", function (response: any) {
              setIsLoading(false)
              showAlert({
                title: response.error.code,
                description: response.error.description,
                type: "destructive",
                clickClose: { text: "Close" },
              })
            })
          } else {
            showAlert({
              title: "Not Authorized.",
              type: "destructive",
              description: "Sign in into your account to join this event.",
              action: {
                text: "Sign in",
                cancelText: "Cancel",
                callback: () =>
                  router.push(`/signin?redirect=workshop/${workshopId}`),
              },
            })
          }
        }}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </>
        ) : isParticipated ? (
          "Already Participated"
        ) : timeExpired ? (
          "Registration Closed"
        ) : (
          children
        )}
      </Button>
    </>
  )
}
