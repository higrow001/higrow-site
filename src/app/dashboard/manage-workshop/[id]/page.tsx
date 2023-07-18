"use client"
import { useRouter } from "next/navigation"

export default function ManageWorkshop({ params }: { params: { id: string } }) {
  const router = useRouter()
  router.replace(`/dashboard/manage-workshop/${params.id}/announcements`)
  return <></>
}
