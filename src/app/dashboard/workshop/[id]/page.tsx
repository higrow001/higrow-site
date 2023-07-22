import Link from "next/link"

export default function WorkshopDetails({
  params,
}: {
  params: { id: string }
}) {
  return <Link href={`/dashboard/workshop/${params.id}/details`}>go</Link>
}
