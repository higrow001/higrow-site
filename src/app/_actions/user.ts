"use server"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/lib/types/database"
import { redirect } from "next/navigation"

const supabase = createServerActionClient({ cookies })

type User = Database["public"]["Tables"]["users"]["Row"]

export async function getUser(user_id?: string) {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = await supabase
    .from("users")
    .select("*")
    .eq("id", user_id ?? session?.user.id)
    .maybeSingle()
  if (user.data) return user.data as User
}

export async function updatePassword(data: FormData) {
  const newPassword = data.get("new_password")
  const confirmNewPassword = data.get("confirm_password")
  if (newPassword === confirmNewPassword) {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    await supabase.auth.updateUser({ password: newPassword!.toString() })
    if (session) redirect("/dashboard/enrolled")
    else redirect("/")
  }
}
