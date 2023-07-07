import { TimestampType } from "@/app/_actions/workshop"
import { Timestamp } from "firebase/firestore"

export function formatDateInDDMMYYYY(input: TimestampType) {
  const timestamp = new Timestamp(input.seconds, input.nanoseconds)
  const date = new Date(timestamp.toDate())

  let day = date.getDate()
  let dayWithZero = day < 10 ? `0${day}` : day
  let month = date.getMonth() + 1
  let monthWithZero = month < 10 ? `0${month}` : month
  let year = date.getFullYear()
  let formattedDate = dayWithZero + " / " + monthWithZero + " / " + year

  return formattedDate
}
