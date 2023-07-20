"use client"
import SignOutBtn from "@/components/dashboard/sign-out"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function SideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
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
          <Link
            href="/dashboard/enrolled"
            className={`"text-lg py-6 px-12 border-b border-[#757575] transition ${
              pathname.includes("enrolled")
                ? "bg-secondary-darker"
                : "hover:bg-secondary-darker"
            }`}
          >
            Enrolled
          </Link>
          <Link
            href="/dashboard/admin"
            className={`"text-lg py-6 px-12 border-b border-[#757575] transition ${
              pathname.includes("admin")
                ? "bg-secondary-darker"
                : "hover:bg-secondary-darker"
            }`}
          >
            Organized
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
