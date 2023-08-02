import { getWorkshop } from "@/app/_actions/workshop"
import AcceptDeclineRequestBtn from "@/components/client-buttons/accept-decline-btn"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import checkSession from "@/lib/utils/check-session"
import { formatDateInDDMMYYYY } from "@/lib/utils/format-date"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function Participants({ params }: { params: { id: string } }) {
  await checkSession(`/signin?redirect=dashboard/manage-workshop/${params.id}/participants`)
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  const workshop = await getWorkshop(params.id)
  if (workshop?.created_by !== session?.user.id) redirect("/")
  return (
    <>
      {workshop && workshop.participants.length > 0 ||
        workshop && workshop.requested_participants.length > 0 ? (
        <Table className="bg-background">
          <TableCaption>A list of participated users.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[25%] whitespace-nowrap">Name</TableHead>
              <TableHead className="w-[20%] whitespace-nowrap">
                Apply date
              </TableHead>
              <TableHead className="w-[30%] whitespace-nowrap">
                Email
              </TableHead>
              {!workshop.is_paid && (
                <TableHead className="w-[25%] whitespace-nowrap">
                  Accept/Decline
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {!workshop.is_paid &&
              workshop.requested_participants.map((part, index) => (
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
                    <AcceptDeclineRequestBtn participants={workshop.participants} requested_participants={workshop.requested_participants} currentUser={part} workshop_id={params.id} workshop_title={workshop.name} />
                  </TableCell>
                </TableRow>
              ))}
            {workshop && workshop.participants.map((part, index) => (
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
                {!workshop.is_paid && (
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
  )
}
