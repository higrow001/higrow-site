"use client"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export default function SideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()

  return (
    <div className="flex h-full">
      <aside className="lg:basis-[20%] fixed lg:relative bg-secondary h-full flex flex-col justify-between text-white">
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
          <button
            className="text-lg py-6 px-12 border-t text-start border-[#757575] hover:bg-[#2c2c2c] transition"
            onClick={async () => {
              await supabase.auth.signOut()
              router.push("/")
            }}
          >
            Log Out
          </button>
        </div>
      </aside>
      <div className="lg:hidden"></div>
      {children}
    </div>
  )
}
