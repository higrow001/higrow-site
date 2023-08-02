"use server"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { NotificationType } from "@/lib/types"
const supabase = createServerActionClient({ cookies })

export async function getNotifications() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const notifics = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", session!.user.id)
    .single()
  return notifics.data as NotificationType
}
