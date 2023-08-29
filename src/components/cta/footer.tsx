import React from "react"
import Link from "next/link"
import { Button } from "../ui/button"

const CTA = () => {
  return (
    <div className="bg-white pt-24 pb-24 ">
      <div className="w-[85%] md:w-[80%] m-auto flex flex-col gap-10">
        <div className="cta-top w-[100%] text-center">
          <h1 className="text-[30px] font-medium md:w-[70%] tracking-wide m-[auto] md:text-[58px] font-archivo text-[#333]"> Have some skills? Someone out there wants to learn </h1>
        </div>
        <div className="cta-bottom w-[100%] flex justify-center gap-5 md:gap-10">
        <Link href="/organize/workshop"> 
          <button className="h-12 md:h-16 text-sm md:text-lg px-8 md:px-14 bg-secondary md:hover:bg-secondary/90 text-primary-foreground md:hover:shadow-[6px_6px_0_#333] hover:shadow-[2px_2px_0_#333]">Organize Workshop</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CTA
