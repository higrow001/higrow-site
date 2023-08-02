"use server"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/lib/types/database"

const supabase = createServerActionClient({ cookies })

type UserType = Database["public"]["Tables"]["users"]["Row"]

export async function getUser(user_id?: string) {
  const session = await supabase.auth.getSession()
  const user = await supabase
    .from("users")
    .select("*")
    .eq("id", user_id ?? session.data.session?.user.id)
    .maybeSingle()
  if (user.data) return user.data as UserType
}
