"use client"
import { getParticipants } from "@/app/_actions/workshop"
import ParticipantsSkeleton from "@/components/skeletons/workkshop-participants"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { db } from "@/lib/firebase"
import { Participant, PublicWorkshopData } from "@/lib/types"
import { formatDateInDDMMYYYY } from "@/lib/utils/format-date"
import {
  Timestamp,
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore"
import { Check, X } from "lucide-react"
import { useEffect, useState } from "react"

export default function Participants({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<
    Pick<PublicWorkshopData, "is_paid"> & {
      participants: Participant[]
      requested_participants: Participant[]
    }
  >({ is_paid: false, requested_participants: [], participants: [] })
  const getData = async () => {
    const res = await getParticipants(params.id)
    setData(res)
    setIsLoading(false)
  }

  useEffect(() => {
    getData()
    const unsubreq = onSnapshot(
      query(
        collection(db, "workshops", params.id, "requested_participants"),
        orderBy("application_date", "desc")
      ),
      (docs) => {
        if (!docs.empty) {
          let reqparts: Participant[] = []
          docs.forEach((doc) => {
            reqparts.push({
              id: doc.id,
              application_date: doc.data().application_date,
              name: doc.data().name,
              email: doc.data().email,
            })
          })
          setData({
            is_paid: data.is_paid,
            requested_participants: reqparts,
            participants: data.participants,
          })
        }
      }
    )
    const unsubparts = onSnapshot(
      query(
        collection(db, "workshops", params.id, "participants"),
        orderBy("application_date", "desc")
      ),
      (docs) => {
        if (!docs.empty) {
          let parts: Participant[] = []
          docs.forEach((doc) => {
            parts.push({
              id: doc.id,
              application_date: doc.data().application_date,
              name: doc.data().name,
              email: doc.data().email,
            })
          })
          setData({
            is_paid: data.is_paid,
            requested_participants: data.requested_participants,
            participants: parts,
          })
        }
      }
    )
    return () => {
      unsubreq()
      unsubparts()
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
                  <TableHead className="w-40">Name</TableHead>
                  <TableHead className="w-52">Apply date</TableHead>
                  <TableHead className="w-60">Email</TableHead>
                  {!data.is_paid && <TableHead>Accept/Decline</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {!data.is_paid &&
                  data.requested_participants.map((part) => (
                    <TableRow key={part.id}>
                      <TableCell className="font-medium">{part.name}</TableCell>
                      <TableCell>
                        {formatDateInDDMMYYYY(part.application_date)}
                      </TableCell>
                      <TableCell>{part.email}</TableCell>
                      <TableCell className="space-x-2">
                        <Button
                          onClick={async () => {
                            await addDoc(
                              collection(
                                db,
                                "workshops",
                                params.id,
                                "participants"
                              ),
                              {
                                name: part.name,
                                email: part.email,
                                application_date: Timestamp.fromDate(
                                  new Timestamp(
                                    part.application_date.seconds,
                                    part.application_date.nanoseconds
                                  ).toDate()
                                ),
                              }
                            )
                            const user = await getDocs(
                              query(
                                collection(db, "users"),
                                where("email", "==", part.email)
                              )
                            )
                            if (!user.empty) {
                              await updateDoc(
                                doc(db, "users", user.docs[0].id),
                                {
                                  participated_workshops: arrayUnion(part.id),
                                }
                              )
                            }
                            await deleteDoc(
                              doc(
                                db,
                                "workshops",
                                params.id,
                                "requested_participants",
                                part.id
                              )
                            )
                          }}
                          variant={"outline"}
                          size={"sm"}
                        >
                          <Check className="w-5 h-5 mr-2" /> Accept
                        </Button>
                        <Button
                          onClick={async () => {
                            await deleteDoc(
                              doc(
                                db,
                                "workshops",
                                params.id,
                                "requested_participants",
                                part.id
                              )
                            )
                          }}
                          variant={"outline"}
                          size={"sm"}
                        >
                          <X className="w-5 h-5 mr-2" /> Decline
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                {data.participants.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell className="font-medium">{part.name}</TableCell>
                    <TableCell>
                      {formatDateInDDMMYYYY(part.application_date)}
                    </TableCell>
                    <TableCell>{part.email}</TableCell>
                    {!data.is_paid && <TableCell>Accepted</TableCell>}
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
