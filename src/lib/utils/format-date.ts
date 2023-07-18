import { Timestamp } from "firebase/firestore"
import { TimestampType } from "../types"

export function formatDateInDDMMYYYY(input: TimestampType, showTime = false) {
  const timestamp = new Timestamp(input.seconds, input.nanoseconds)
  const date = new Date(timestamp.toDate())

  const day = date.getDate()
  const dayWithZero = day < 10 ? `0${day}` : day

  const month = date.getMonth() + 1
  const monthWithZero = month < 10 ? `0${month}` : month

  const year = date.getFullYear()

  const formattedDate = dayWithZero + " / " + monthWithZero + " / " + year

  const hours = date.getHours()
  const hoursWithZero = hours < 10 ? `0${hours}` : hours

  const minutes = date.getMinutes()
  const minutesWithZero = minutes < 10 ? `0${minutes}` : minutes

  const formattedDateWithTime =
    formattedDate + " - " + hoursWithZero + ":" + minutesWithZero

  if (!showTime) return formattedDate
  return formattedDateWithTime
}
