"use server"
import { v4 as uuid } from "uuid"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { NotificationData, NotificationType } from "@/lib/types"
import { revalidatePath } from "next/cache"
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

export async function createNotification(
  {
    title,
    redirect_path,
    workshop_id,
    reference_field,
  }: Pick<
    NotificationData,
    "title" | "redirect_path" | "workshop_id" | "reference_field"
  >,
  user_email?: string,
  user_id?: string
) {
  const {
    workshop_readed: currentNotifications,
    workshop_new: newUnreadNotifications,
  } = await getNotifications()
  if (reference_field) {
    if (
      !!currentNotifications.filter(
        (noti) =>
          noti.reference_field === reference_field &&
          noti.workshop_id === workshop_id
      ).length
    ) {
      const noti = currentNotifications.filter(
        (noti) =>
          noti.reference_field === reference_field &&
          noti.workshop_id === workshop_id
      )[0]
      noti.timestamp = new Date().toISOString()
      const newReads = currentNotifications.filter(
        (notii) => notii.id !== noti.id
      )
      noti.id = uuid()
      const newNews = newUnreadNotifications
      newNews.unshift(noti)
      if (user_email)
        await supabase
          .from("notifications")
          .update({
            workshop_new: newNews,
            workshop_readed: newReads,
          })
          .eq("user_email", user_email)
      if (user_id)
        await supabase
          .from("notifications")
          .update({
            workshop_new: newNews,
            workshop_readed: newReads,
          })
          .eq("user_id", user_id)
      return
    }
    if (
      !!newUnreadNotifications.filter(
        (noti) =>
          noti.reference_field === reference_field &&
          noti.workshop_id === workshop_id
      ).length
    ) {
      const noti = newUnreadNotifications.filter(
        (noti) =>
          noti.reference_field === reference_field &&
          noti.workshop_id === workshop_id
      )[0]
      noti.timestamp = new Date().toISOString()
      const newNews = newUnreadNotifications.filter(
        (notii) => notii.id !== noti.id
      )
      newNews.unshift(noti)
      if (user_email)
        await supabase
          .from("notifications")
          .update({
            workshop_new: newNews,
          })
          .eq("user_email", user_email)
      if (user_id)
        await supabase
          .from("notifications")
          .update({
            workshop_new: newNews,
          })
          .eq("user_id", user_id)
      return
    }
    newUnreadNotifications.unshift({
      id: uuid(),
      title,
      timestamp: new Date().toISOString(),
      redirect_path: redirect_path ?? null,
      workshop_id,
      reference_field,
    })
    if (user_email)
      await supabase
        .from("notifications")
        .update({
          workshop_new: newUnreadNotifications,
        })
        .eq("user_email", user_email)
    if (user_id)
      await supabase
        .from("notifications")
        .update({
          workshop_new: newUnreadNotifications,
        })
        .eq("user_id", user_id)
    return
  }
  newUnreadNotifications.unshift({
    id: uuid(),
    title,
    timestamp: new Date().toISOString(),
    redirect_path: redirect_path ?? null,
    workshop_id,
    reference_field: null,
  })
  if (user_email)
    await supabase
      .from("notifications")
      .update({
        workshop_new: newUnreadNotifications,
      })
      .eq("user_email", user_email)
  if (user_id)
    await supabase
      .from("notifications")
      .update({
        workshop_new: newUnreadNotifications,
      })
      .eq("user_id", user_id)
}

export async function markAllNotificationsRead() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const {
    workshop_readed: currentNotifications,
    workshop_new: newUnreadNotifications,
  } = await getNotifications()
  if (!!!newUnreadNotifications.length) return
  currentNotifications.unshift(...newUnreadNotifications)
  newUnreadNotifications.splice(0, newUnreadNotifications.length)

  await supabase
    .from("notifications")
    .update({
      workshop_new: newUnreadNotifications,
      workshop_readed: currentNotifications,
    })
    .eq("user_id", session!.user.id)
  revalidatePath("/dashboard/admin")
  revalidatePath("/dashboard/enrolled")
}

export async function deleteAllReadedNotifications() {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const {
    workshop_readed: currentNotifications,
    workshop_new: newUnreadNotifications,
  } = await getNotifications()
  if (!!!currentNotifications.length) return

  await supabase
    .from("notifications")
    .update({
      workshop_new: newUnreadNotifications,
      workshop_readed: [],
    })
    .eq("user_id", session!.user.id)
  revalidatePath("/dashboard/admin")
  revalidatePath("/dashboard/enrolled")
}
