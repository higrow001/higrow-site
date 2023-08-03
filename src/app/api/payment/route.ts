import { WorkshopDetails } from "@/components/client-buttons/payment-button"
import { razorpay } from "@/lib/razorpay"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const workshopDetails: WorkshopDetails = await request.json()
  var options = {
    amount: workshopDetails.amount * 100,
    currency: "INR",
    notes: {
      contact_email: workshopDetails.organizerEmail,
      workshop_id: workshopDetails.workshopId,
      workshop_name: workshopDetails.workshopName,
    },
  }

  return new Promise((resolve) => {
    razorpay.orders.create(options, function (err, order) {
      if (err) {
        console.log(err)
        resolve(NextResponse.json({ error: true }, { status: 400 }))
      }
      resolve(NextResponse.json({ order, error: false }, { status: 200 }))
    })
  })
}
