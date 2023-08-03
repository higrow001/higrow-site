import { Database } from "./database"

export interface Announcement {
  title: string
  message: string
  timestamp: string
}

export interface Participant {
  name: string
  email: string
  application_date: string
}

export interface PaymentRecord {
  order_id: string
  payment_id: string
  signature: string
}

export interface PrivateWorkshopData {
  bank_name: string
  bank_email: string
  bank_account_number: string
  bank_ifsc: string
  payment_records: PaymentRecord[]
}

export type ModifiedWorkshopType = {
  participants: Participant[]
  requested_participants: Participant[]
  announcements: Announcement[]
  payment_records: PaymentRecord[] | null
  bank_details: { [key: string]: string }
}

type WorkshopType = Database["public"]["Tables"]["workshops"]["Row"]
type OmittedWorkshopType = Omit<
  WorkshopType,
  | "announcements"
  | "participants"
  | "requested_participants"
  | "payment_records"
  | "bank_details"
>

export type WorkshopDataType = OmittedWorkshopType & ModifiedWorkshopType

export interface NotificationData {
  id: string
  title: string
  timestamp: string
  workshop_id: string
  reference_field?: string | null
  number_value?: number | null
  redirect_path?: string | null
}

type DBNotification = Database["public"]["Tables"]["notifications"]["Row"]
type OmittedNotification = Omit<
  DBNotification,
  "workshop_new" | "workshop_readed"
>
interface ModifiedNotificationType {
  workshop_new: NotificationData[]
  workshop_readed: NotificationData[]
}

export type NotificationType = OmittedNotification & ModifiedNotificationType
