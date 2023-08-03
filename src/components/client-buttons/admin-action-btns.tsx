"use client"
import { useTransition } from "react";
import { Button } from "../ui/button";
import { acceptWorkshopProposal, declineWorkshopProposal } from "@/app/_actions/admin";

export default function AdminActionBtns({ workshop_id, user_id, workshop_title }: { workshop_id: string; user_id: string, workshop_title: string }) {
  const [isPending, startTransition] = useTransition()
  return isPending ? <p className="text-center px-8">Loading...</p> : <>
    <Button
      onClick={() => startTransition(async () => {
        await declineWorkshopProposal(workshop_id, workshop_title, user_id)
      })}
      variant={"secondary"}
      className="border-none mr-4 px-6"
    >
      Decline
    </Button>
    <Button
      onClick={() => startTransition(async () => {
        await acceptWorkshopProposal(workshop_id, workshop_title, user_id)
      })}
      className="border-none px-8"
    >
      Approve
    </Button>
  </>
}
