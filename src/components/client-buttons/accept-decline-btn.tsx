"use client"
import { Participant } from "@/lib/types";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import { useTransition } from "react";
import { acceptParticipantRequest, declineParticipantRequest } from "@/app/_actions/workshop";
import LoadingSpinner from "../loading-spinner";

export default function AcceptDeclineRequestBtn({ participants, requested_participants, currentUser, workshop_id, workshop_title }: { participants: Participant[], requested_participants: Participant[], currentUser: Participant, workshop_id: string; workshop_title: string }) {
  const [isPending, startTransition] = useTransition()
  return isPending ? (
    <LoadingSpinner sizeStyle="w-7 h-7" />
  ) : (
    <>
      <Button
        onClick={() => startTransition(async () => {
          await acceptParticipantRequest(participants, requested_participants, currentUser, workshop_id, workshop_title)
        })}
        variant={"outline"}
        size={"sm"}
        className="text-xs"
      >
        <Check className="md:w-5 nd:h-5 h-4 w-4 mr-2" />{" "}
        Accept
      </Button>
      <Button
        onClick={() => startTransition(async () => {
          await declineParticipantRequest(requested_participants, currentUser, workshop_id, workshop_title)
        })}
        variant={"outline"}
        size={"sm"}
        className="text-xs"
      >
        <X className="md:w-5 nd:h-5 h-4 w-4 mr-2" /> Decline
      </Button>
    </>
  )
}
