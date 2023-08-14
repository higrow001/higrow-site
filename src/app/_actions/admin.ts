"use server"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"
import { createNotification } from "./notification"
import { getUser } from "./user"
import { WorkshopRejectTemplate } from "@/components/email-templates/workshop-reject"
import { WorkshopAcceptTemplate } from "@/components/email-templates/workshop-accept"
const supabase = createServerActionClient({ cookies })

export async function declineWorkshopProposal(
  workshop_id: string,
  workshop_title: string,
  created_user_id: string
) {
  await supabase.from("workshops").delete().eq("id", workshop_id)
  const user = await getUser(created_user_id)
  const newOrgs = user?.organized_workshops.filter((id) => id !== workshop_id)
  await supabase
    .from("users")
    .update({
      organized_workshops: newOrgs,
    })
    .eq("id", user?.id)
  await createNotification(
    {
      title: `Sorry, your '${workshop_title}' workshop has been denied. Please review and resubmit.`,
      workshop_id: workshop_id,
    },
    undefined,
    created_user_id
  )
  
  try {
    /* @ts-ignore */
    const data = await resend.emails.send({
      from: "HiGrow <onboarding@resend.dev>",
      to: ["higrow25@gmail.com"],
      subject: "We're sorry! Your workshop got rejected.",
      react: WorkshopRejectTemplate({
        pageLink: `https://higrow.xyz/organize/workshop`,
        workshopName: workshop_title,
      }),
    })
    console.log(data)
  } catch (error) {
    console.log(error)
  }
  revalidatePath("/admin/manage")
}

export async function acceptWorkshopProposal(
  workshop_id: string,
  workshop_title: string,
  created_user_id: string
) {
  await supabase
    .from("workshops")
    .update({ approved: true })
    .eq("id", workshop_id)
  await createNotification(
    {
      title: `Congratulations! Your '${workshop_title}' workshop is approved.`,
      workshop_id: workshop_id,
      redirect_path: `/workshop/${workshop_id}`,
    },
    undefined,
    created_user_id
  )
  try {
    /* @ts-ignore */
    const data = await resend.emails.send({
      from: "HiGrow <onboarding@resend.dev>",
      to: ["higrow25@gmail.com"],
      subject: "Congratulations! Your workshop is accepted!",
      react: WorkshopAcceptTemplate({
        pageLink: `https://higrow.xyz/dashboard/manage-workshop/${workshop_id}`,
        workshopName: workshop_title,
      }),
    })
    console.log(data)
  } catch (error) {
    console.log(error)
  }
  revalidatePath("/admin/manage")
}
