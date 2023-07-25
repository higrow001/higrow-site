import { Database } from "./database"

export interface PublicWorkshopData {
  name: string
  tagline: string
  mode: string
  category: string
  application_closing_date: string
  workshop_starting_date: string
  workshop_ending_date: string
  contact_email: string
  redirect_url: string
  social_links: string[]
  instructor_info: string
  instructor_name: string
  workshop_info: string
  working_days: number
  time_format: string
  time_per_day: number
  describe_each_day: string
  is_paid: boolean
  workshop_amount: number | null
  created_on: string
  created_by: string
  approved: boolean
}

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
