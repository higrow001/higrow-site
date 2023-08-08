"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAdminAccess } from "@/states/admin"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"

function AdminPage() {
  const supabase = createClientComponentClient()
  const { adminAccess, setAdminAccess } = useAdminAccess()
  const router = useRouter()
  if (adminAccess) router.replace("admin/manage")
  async function adminAuth(data: FormData) {
    const { data: creds } = await supabase
      .from("admin_creds")
      .select("*")
      .single()
    if (
      creds.email === data.get("email") &&
      creds.password === data.get("password")
    ) {
      setAdminAccess(true)
      router.replace("/admin/manage")
    }
  }
  return (
    <main className="flex justify-center flex-col min-h-full items-center bg-accent">
      <Link
        href="/"
        className="text-[36px] font-semibold font-archivo pb-16 underline  text-[#333] "
      >
        Go To Home
      </Link>{" "}
      <div className="p-20 max-w-xl border shadow flex flex-col items-center space-y-20 rounded-lg w-full signup-card bg-background">
        <h1 className="text-4xl font-archivo font-bold text-[#333333]">
          Sign in for Admin
        </h1>
        <form action={adminAuth} className="w-full">
          <div className="flex flex-col space-y-8 items-center w-full">
            <Input
              name="email"
              type="email"
              className="px-4 text-lg"
              placeholder="Email"
              required
            />
            <Input
              name="password"
              className="px-4 text-lg"
              type="password"
              placeholder="Password"
              required
            />
          </div>
          <div className="flex flex-col space-y-8 items-center w-full mt-20">
            <Button
              className="text-lg font-archivo w-full px-6 rounded-xl"
              type="submit"
              size="xl"
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default AdminPage
