"use server"
import { getDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { initialValues } from "@/lib/utils/organize-workshop"

type ValuesType = typeof initialValues
export type TimestampType = {
  seconds: number
  nanoseconds: number
}
type DatesFromFirebase = {
  applicationClosingDate: TimestampType
  workshopStartingDate: TimestampType
  workshopEndingDate: TimestampType
  id: string
}
type WorkshopWithoutDatesType = Omit<
  ValuesType,
  | "bankName"
  | "bankEmail"
  | "bankAccNo"
  | "bankIFSC"
  | "workshopEndingDate"
  | "workshopStartingDate"
  | "applicationClosingDate"
>

export type WorkshopDataType = DatesFromFirebase & WorkshopWithoutDatesType

export async function getUserOrganizedWorkshops({ ids }: { ids: string[] }) {
  let finalData: WorkshopDataType[] = []
  const req = await Promise.all(
    ids.map((id) => getDoc(doc(db, "workshops", id)))
  )
  req.forEach((data) => {
    if (data.exists()) {
      finalData.push({ ...data.data().public, id: data.id })
    }
  })
  return finalData
}

export async function getWorkshop(id: string) {
  const fetchData = await getDoc(doc(db, "workshops", id))
  if (fetchData.exists()) return fetchData.data().public
}
