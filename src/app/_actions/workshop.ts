"use server"
import { cookies } from "next/headers"
import { PaymentRecord, WorkshopDataType } from "@/lib/types"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/lib/types/database"

const supabase = createServerActionClient({ cookies })

type UserType = Database["public"]["Tables"]["users"]["Row"]

export async function getWorkshop(id: string) {
  const fetchData = await supabase.from("workshops").select("*").eq("id", id)
  if (fetchData.data) {
    return fetchData.data[0] as WorkshopDataType
  }
}

export async function getUser() {
  const session = await supabase.auth.getSession()
  const user = await supabase
    .from("users")
    .select("*")
    .eq("id", session.data.session?.user.id)
    .maybeSingle()
  if (user.data) return user.data as UserType
}

export async function getUserOrganizedWorkshops() {
  const userData = await getUser()
  if (userData) {
    const ids = userData.organized_workshops
    const { data } = await supabase
      .from("workshops")
      .select(
        "name, workshop_starting_date, id, workshop_ending_date, application_closing_date, announcements"
      )
      .in("id", ids)
      .order("created_at", { ascending: false })
    if (data) {
      return data as Pick<
        WorkshopDataType,
        | "id"
        | "name"
        | "application_closing_date"
        | "workshop_starting_date"
        | "workshop_ending_date"
        | "announcements"
      >[]
    }
  }
  return []
}

export async function getParticipatedWorkshops() {
  const userData = await getUser()
  if (userData) {
    const ids = userData.participated_workshops
    const { data } = await supabase
      .from("workshops")
      .select(
        "name, workshop_starting_date, id, workshop_ending_date, application_closing_date, announcements"
      )
      .in("id", ids)
      .order("created_at", { ascending: false })
    if (data) {
      return data as Pick<
        WorkshopDataType,
        | "id"
        | "name"
        | "application_closing_date"
        | "workshop_starting_date"
        | "workshop_ending_date"
        | "announcements"
      >[]
    }
  }
  return []
}

export async function requestWorkshop(workshop_id: string) {
  const workshopData = await getWorkshop(workshop_id)
  const userData = await getUser()
  if (workshopData && userData) {
    const shopsReqs = workshopData.requested_participants
    shopsReqs.push({
      name: userData.display_name,
      email: userData.email,
      application_date: new Date().toISOString(),
    })
    await supabase
      .from("workshops")
      .update({ requested_participants: shopsReqs })
      .eq("id", workshop_id)
  }
}

export async function joinWorkshop(
  workshop_id: string,
  payment_record: PaymentRecord
) {
  const workshopData = await getWorkshop(workshop_id)
  const userData = await getUser()
  if (workshopData && userData) {
    const shopsParticipants = workshopData.participants
    const pay_recs = workshopData.payment_records ?? []
    const user_parts = userData.participated_workshops
    pay_recs.push(payment_record)
    user_parts.push(workshop_id)
    shopsParticipants.push({
      name: userData.display_name,
      email: userData.email,
      application_date: new Date().toISOString(),
    })
    const { error: e1 } = await supabase
      .from("workshops")
      .update({ participants: shopsParticipants, payment_records: pay_recs })
      .eq("id", workshop_id)
    const { error: e2 } = await supabase
      .from("users")
      .update({ participated_workshops: user_parts })
      .eq("id", userData.id)
    console.log(e1, e2)
  }
}

export async function getAnnouncements(workshop_id: string) {
  const workshop = await getWorkshop(workshop_id)
  return workshop?.announcements ?? []
}

type GetWorkshopProps = {
  [key: string]: string | number | undefined
}

export async function getWorkshops({
  categories,
  search,
  limit,
}: GetWorkshopProps) {
  const everyCategory = categories?.toString().split(".") ?? []
  const refinedSearch = search?.toString().replace("+", " ") ?? null

  let baseQuery = supabase
    .from("workshops")
    .select("*")
    .order("created_at", { ascending: false })

  if (limit) baseQuery = baseQuery.limit(Number(limit))

  if (everyCategory.length > 0)
    baseQuery = baseQuery.in("category", everyCategory)

  if (refinedSearch) {
    const workshops = await baseQuery.ilike("name", `%${refinedSearch}%`)
    return workshops.data as WorkshopDataType[]
  } else {
    const workshops = await baseQuery
    return workshops.data as WorkshopDataType[]
  }
}
