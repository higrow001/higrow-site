"use client"
import { getUser, getWorkshop } from "@/app/_actions/workshop"
import ParticipantsSkeleton from "@/components/skeletons/workkshop-participants"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Participant, PublicWorkshopData } from "@/lib/types"
import { formatDateInDDMMYYYY } from "@/lib/utils/format-date"
import { useAlert } from "@/states/alert"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { RealtimeChannel } from "@supabase/supabase-js"
import { Check, X } from "lucide-react"
import { useEffect, useState } from "react"

export default function Participants({ params }: { params: { id: string } }) {
  const { showAlert } = useAlert()
  const supabase = createClientComponentClient()
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<
    Pick<PublicWorkshopData, "is_paid"> & {
      participants: Participant[]
      requested_participants: Participant[]
    }
  >({ is_paid: false, requested_participants: [], participants: [] })
  const getData = async () => {
    const res = await getWorkshop(params.id)
    setData(res!)
    setIsLoading(false)
  }

  useEffect(() => {
    getData()
    let unsub: RealtimeChannel
    try {
      unsub = supabase
        .channel("db_table_changes")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "workshops",
            filter: `id=eq.${params.id}`,
          },
          (payload) => {
            setData({
              is_paid: data.is_paid,
              participants: payload.new.participants,
              requested_participants: payload.new.requested_participants,
            })
          }
        )
        .subscribe()
    } catch (error) {
      showAlert({
        title: "Realtime updates not available.",
        description:
          "You will not get the UI updates when you accept or decline an user request to join. Just refresh the page after clicking button to make sure it updated.",
        type: "destructive",
      })
    }
    return () => {
      unsub.unsubscribe()
    }
  }, [])
  return (
    <>
      {isLoading ? (
        <ParticipantsSkeleton />
      ) : (
        <>
          {data.participants.length > 0 ||
          data.requested_participants.length > 0 ? (
            <Table className="bg-background">
              <TableCaption>A list of participated users.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[25%]">Name</TableHead>
                  <TableHead className="w-[20%]">Apply date</TableHead>
                  <TableHead className="w-[30%]">Email</TableHead>
                  {!data.is_paid && <TableHead className="w-[25%]">Accept/Decline</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {!data.is_paid &&
                  data.requested_participants.map((part, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {part.name}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDateInDDMMYYYY(part.application_date)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {part.email}
                      </TableCell>
                      <TableCell className="space-x-2 whitespace-nowrap">
                        <Button
                          onClick={async () => {
                            const partis = data.participants
                            partis.push({
                              name: part.name,
                              email: part.email,
                              application_date: part.application_date,
                            })
                            const req_parts =
                              data.requested_participants.filter(
                                (parti) => parti.email !== part.email
                              )
                            const user = await getUser()
                            if (user) {
                              const part_shops = user.participated_workshops
                              part_shops.push(params.id)
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
                              .eq("id", params.id)
                          }}
                          variant={"outline"}
                          size={"sm"}
                          className="text-xs"
                        >
                          <Check className="md:w-5 nd:h-5 h-4 w-4 mr-2" />{" "}
                          Accept
                        </Button>
                        <Button
                          onClick={async () => {
                            const reqparts = data.requested_participants.filter(
                              (parti) => parti.email !== part.email
                            )
                            await supabase
                              .from("workshops")
                              .update({ requested_participants: reqparts })
                              .eq("id", params.id)
                          }}
                          variant={"outline"}
                          size={"sm"}
                          className="text-xs"
                        >
                          <X className="md:w-5 nd:h-5 h-4 w-4 mr-2" /> Decline
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                {data.participants.map((part, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium whitespace-nowrap">
                      {part.name}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDateInDDMMYYYY(part.application_date)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {part.email}
                    </TableCell>
                    {!data.is_paid && (
                      <TableCell className="whitespace-nowrap">
                        Accepted
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-xl font-semibold text-secondary">
              No user participated till now.
            </p>
          )}
        </>
      )}
    </>
  )
}
