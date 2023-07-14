"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { useState, useEffect } from "react"
import { formatDateInDDMMYYYY } from "@/lib/utils/format-date"
import { useUser } from "@/states/user"
import { ChevronRight } from "lucide-react"
import { PublicWorkshopData } from "@/lib/types"
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore"
import { db } from "@/lib/firebase"

type Data = PublicWorkshopData & { id: string }

function OrganizedWorkshops() {
  const [workshops, setWorkshops] = useState<Data[]>([])
  const ids = useUser((state) => state.organizedWorkshops)
  const getShops = async () => {
    const allShops: Data[] = []
    const shops = await getDocs(
      query(
        collection(db, "workshops"),
        where(documentId(), "in", ids),
        limit(3)
      )
    )
    if (!shops.empty) {
      shops.docs.forEach((doc) => {
        allShops.push({ id: doc.id, ...doc.data().public })
      })
    }
    setWorkshops(allShops)
  }

  useEffect(() => {
    if (ids.length > 0) getShops()
  }, [ids])

  return (
    <div className="space-y-8">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-3xl font-archivo text-secondary">
          Organized Opportunities
        </h1>
        <Link href="/dashboard/all-workshops">
          <Button variant={"outline"}>See All</Button>
        </Link>
      </div>
      <div className="space-y-4">
        {workshops.length > 0 &&
          workshops.map((workshop, index) => (
            <div
              key={index}
              className="flex w-full py-4 px-4 items-center border border-input bg-background rounded-md divide-x-2 divide-input"
            >
              <span className="px-4">{`0${index + 1}.`}</span>
              <h2 className="text-lg px-4 grow-[3] truncate">
                {workshop.name} by {workshop.instructor_name}
              </h2>
              <span className="px-4 shrink-0">{`${formatDateInDDMMYYYY(
                workshop.application_closing_date
              )}`}</span>
              <span className="text-primary-lighter text-center shrink-0 grow-[2] font-semibold px-4">
                Accepting applications
              </span>
              <Link className="px-4" href={`/workshop/${workshop.id}`}>
                <ChevronRight className="text-secondary w-16 h-6 px-4" />
              </Link>
            </div>
          ))}
      </div>
    </div>
  )
}

export default OrganizedWorkshops
