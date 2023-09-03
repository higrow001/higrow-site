import Link from "next/link"
import React from "react"

export default function Footer() {
  return (
    <div className="footer-container relative bottom-0 pt-20 pb-20 w-full bg-secondary flex justify-between text-white">
      <div className="f-left m-auto text-center">
        <h1 className="text-[48px] text-left font-archivo font-semibold">HiGrow.</h1>
        <p className="text-[16px] pt-2 w-[80%] text-left font-light"> Empowering minds worldwide to Learn, compete, and grow together</p>
      </div>
      <div className="f-middle   m-auto text-[18px] gap-y-4 font-light  flex flex-col">
        <Link href="/workshops">Workshops</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/organize">Organize</Link>
      </div>
      <div className="f-bottom m-auto text-[18px] gap-y-4 font-light  flex flex-col">
        <Link href="/privacy-policy">Privacy Policy</Link>
        <Link href="/terms-of-service">Terms & Conditions</Link>
        <Link href="/refund-policy">Refund Policy</Link>
        
      </div>
    </div>
  )
}
