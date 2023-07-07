import SignOutBtn from "@/components/dashboard/sign-out"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Dashboard - HiGrow",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full">
      <aside className="basis-[20%] bg-secondary h-full flex flex-col justify-between text-white">
        <div className="flex flex-col">
          <h1 className="font-archivo font-black text-4xl px-12 py-20 border-b border-[#757575]">
            HiGrow.
          </h1>
          <Link
            href="/"
            className="text-lg py-6 px-12 border-b border-[#757575] hover:bg-secondary-darker transition"
          >
            Home
          </Link>
        </div>
        <div className="flex flex-col">
          <SignOutBtn style="text-lg py-6 px-12 border-t text-start border-[#757575] hover:bg-[#2c2c2c] transition" />
        </div>
      </aside>
      {children}
    </div>
  )
}
