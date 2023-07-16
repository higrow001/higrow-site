"use client"

import { TimestampType } from "@/app/_actions/workshop"
import { Timestamp } from "firebase/firestore"
import { useEffect, useState } from "react"

function ReverseTimer({ firebaseDate }: { firebaseDate: TimestampType }) {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, mins: 0 })

  function updateTime() {
    const targetDate = new Date(
      new Timestamp(firebaseDate.seconds, firebaseDate.nanoseconds).toDate()
    )
    const currentDate = new Date()
    const remainingTime = targetDate.getTime() - currentDate.getTime()

    if (remainingTime <= 0) {
      setRemaining({ days: 0, hours: 0, mins: 0 })
    } else {
      const mins = Math.floor((remainingTime / (1000 * 60)) % 60)
      const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24)
      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24))

      setRemaining({ days, hours, mins })
    }
  }

  useEffect(() => {
    updateTime()
    const intervalRef = setInterval(updateTime, 1000 * 60)
    return clearInterval(intervalRef)
  }, [])

  return (
    <div className="border border-secondary p-4 space-y-6 rounded-md">
      <h3 className="font-medium text-lg  text-[#333]">Registration Closes in :-</h3>
      <span className=" text-xl tracking-wider font-bold !mt-2 text-[#007DFB]">
        {remaining.days}d:{remaining.hours}h:{remaining.mins}m
      </span>
    </div>
  )
}

export default ReverseTimer
