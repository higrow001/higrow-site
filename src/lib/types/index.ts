export interface User {
  displayName: string
  email: string
  id: string
  profilePhoto: string | null
  organizedWorkshops: string[]
}

export interface UserActions {
  initUserData: (data: User) => void
}

export type TimestampType = {
  seconds: number
  nanoseconds: number
}

export interface PublicWorkshopData {
  name: string
  tagline: string
  mode: string
  category: string
  application_closing_date: TimestampType
  workshop_starting_date: TimestampType
  workshop_ending_date: TimestampType
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
  workshop_amount: number
  created_on: TimestampType
  created_by: string
  approved: boolean
  editors: string[]
}

export interface Announcement {
  id: string
  title: string
  message: string
  timestamp: TimestampType
}

export interface Participant {
  id: string
  name: string
  email: string
  application_date: TimestampType
}

export interface PrivateWorkshopData {
  bank_name: string
  bank_email: string
  bank_account_number: string
  bank_ifsc: string
  payment_records: { order_id: string; payment_id: string; signature: string }[]
}

export type WorkshopDataType = PublicWorkshopData & PrivateWorkshopData
export type PublicWorkshopWId = PublicWorkshopData & { id: string }
