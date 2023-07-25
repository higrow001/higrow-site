"use client"

import { Button } from "../ui/button"
import Script from "next/script"
import { useAlert } from "@/states/alert"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { joinWorkshop } from "@/app/_actions/workshop"
import { Participant } from "@/lib/types"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export interface WorkshopDetails {
  amount: number
  organizerEmail: string
  workshopId: string
  workshopName: string
  applicationDate: string
  participants: Participant[]
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
  const supabase = createClientComponentClient()
  const [isParticipated, setIsParticipated] = useState(false)
  const [email, setEmail] = useState("")
  const [displayName, setDisplayName] = useState("")
  const { showAlert } = useAlert()
  const [isLoading, setIsLoading] = useState(false)
  const applicationClosingDate = new Date(applicationDate)
  const currentDate = new Date()
  const timeExpired = applicationClosingDate < currentDate

  const checkUpdates = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    setEmail(session?.user.email!)
    setDisplayName(session?.user.user_metadata.full_name!)
  }

  useEffect(() => {
    checkUpdates()
  }, [supabase.auth])
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
          const {
            data: { session },
          } = await supabase.auth.getSession()
          if (session) {
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
                await joinWorkshop(workshopId, {
                  payment_id: response.razorpay_payment_id,
                  order_id: response.razorpay_order_id,
                  signature: response.razorpay_signature,
                })
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
