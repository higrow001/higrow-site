"use server"
import { cookies } from "next/headers"
import {
  Announcement,
  Participant,
  PaymentRecord,
  WorkshopDataType,
} from "@/lib/types"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"
import { getUser } from "./user"
import { createNotification } from "./notification"

const supabase = createServerActionClient({ cookies })

export async function getWorkshop(id: string) {
  const fetchData = await supabase.from("workshops").select("*").eq("id", id)
  if (fetchData.data) {
    return fetchData.data[0] as WorkshopDataType
  }
}

export async function getUserOrganizedWorkshops() {
  const userData = await getUser()
  if (userData) {
    const ids = userData.organized_workshops
    const { data } = await supabase
      .from("workshops")
      .select(
        "name, workshop_starting_date, id, workshop_ending_date, application_closing_date, participants, requested_participants, is_paid, approved"
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
        | "participants"
        | "requested_participants"
        | "is_paid"
        | "approved"
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

export async function requestJoinWorkshop(workshop_id: string) {
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
    await createNotification(
      {
        title: `A new participant requested to join your '${workshopData.name}' workshop.`,
        workshop_id,
        reference_field: "requested_participants",
        redirect_path: `/dashboard/manage-workshop/${workshop_id}/participants`,
      },
      undefined,
      workshopData.created_by
    )
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
    pay_recs.unshift(payment_record)
    user_parts.push(workshop_id)
    shopsParticipants.unshift({
      name: userData.display_name,
      email: userData.email,
      application_date: new Date().toISOString(),
    })
    await supabase
      .from("workshops")
      .update({ participants: shopsParticipants, payment_records: pay_recs })
      .eq("id", workshop_id)
    await supabase
      .from("users")
      .update({ participated_workshops: user_parts })
      .eq("id", userData.id)
    await createNotification(
      {
        title: `Congratulations, a new participant has joined your '${workshopData.name}' workshop.`,
        workshop_id,
        reference_field: "participants",
        redirect_path: `/dashboard/manage-workshop/${workshop_id}/participants`,
      },
      undefined,
      workshopData.created_by
    )
  }
}

type GetWorkshopProps = {
  [key: string]: string | number | undefined | boolean
}

export async function getWorkshops({
  categories,
  search,
  limit,
  approved,
}: GetWorkshopProps) {
  const everyCategory = categories?.toString().split(".") ?? []
  const refinedSearch = search?.toString().replace("+", " ") ?? null

  let baseQuery = supabase
    .from("workshops")
    .select("*")
    .order("created_at", { ascending: false })

  if (typeof approved === "boolean") {
    baseQuery = baseQuery.eq("approved", approved)
  }

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

export async function deleteAnnouncement(
  announcements: Announcement[],
  workshop_id: string,
  removeTimestamp: string
) {
  const newAnnouncements = announcements.filter(
    (anns) => anns.timestamp !== removeTimestamp
  )
  await supabase
    .from("workshops")
    .update({
      announcements: newAnnouncements,
    })
    .eq("id", workshop_id)

  revalidatePath(`/dashboard/manage-workshop/${workshop_id}/announcements`)
}

export async function createAnnouncement(
  announcements: Announcement[],
  workshop_id: string,
  title: string,
  message: string,
  participants: Participant[],
  workshop_title: string
) {
  const anns = announcements
  anns.push({
    title,
    message,
    timestamp: new Date().toISOString(),
  })
  await supabase
    .from("workshops")
    .update({
      announcements: anns,
    })
    .eq("id", workshop_id)
  participants.forEach(async (part) => {
    await createNotification(
      {
        title: `Dear participant, an important announcement has been posted by the organizer in '${workshop_title}' workshop.`,
        workshop_id,
        redirect_path: `/dashboard/workshop/${workshop_id}/announcements`,
      },
      part.email
    )
  })
  revalidatePath(`/dashboard/manage-workshop/${workshop_id}/announcements`)
}

export async function declineParticipantRequest(
  requested_participants: Participant[],
  currentUser: Participant,
  workshop_id: string,
  workshop_title: string
) {
  const reqparts = requested_participants.filter(
    (parti) => parti.email !== currentUser.email
  )
  await supabase
    .from("workshops")
    .update({ requested_participants: reqparts })
    .eq("id", workshop_id)
  await createNotification(
    {
      title: `Apologies, your request has been denied for '${workshop_title}' workshop.`,
      workshop_id,
    },
    currentUser.email
  )
  revalidatePath(`/dashboard/manage-workshop/${workshop_id}/participants`)
}

export async function acceptParticipantRequest(
  participants: Participant[],
  requested_participants: Participant[],
  currentUser: Participant,
  workshop_id: string,
  workshop_title: string
) {
  const partis = participants
  if (!!partis.filter((partt) => partt.email === currentUser.email).length)
    return
  partis.unshift({
    name: currentUser.name,
    email: currentUser.email,
    application_date: currentUser.application_date,
  })
  const req_parts = requested_participants.filter(
    (parti) => parti.email !== currentUser.email
  )
  const user = await getUser()
  if (user) {
    const part_shops = user.participated_workshops
    part_shops.push(workshop_id)
    await supabase
      .from("users")
      .update({
        participated_workshops: part_shops,
      })
      .eq("id", user.id)
  }
  await supabase
    .from("workshops")
    .update({
      requested_participants: req_parts,
      participants: partis,
    })
    .eq("id", workshop_id)
  await createNotification(
    {
      title: `Great news! You're accepted for the '${workshop_title}' workshop.`,
      workshop_id,
      redirect_path: `/dashboard/workshop/${workshop_id}/announcements`,
    },
    currentUser.email
  )
  revalidatePath(`/dashboard/manage-workshop/${workshop_id}/participants`)
}
