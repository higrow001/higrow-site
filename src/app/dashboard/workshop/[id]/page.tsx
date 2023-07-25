import { redirect } from "next/navigation"

export default function WorkshopDetails({
  params,
}: {
  params: { id: string }
}) {
  redirect(`/dashboard/workshop/${params.id}/announcements`)
  return <p>Redirecting</p>
}
