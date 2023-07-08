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

export interface Alert {
  show: boolean
  data: AlertPayload | null
}

export interface AlertActions {
  showAlert: (data: AlertPayload) => void
  showAutoCloseAlert: (data: AlertPayload) => void
  hideAlert: () => void
  resetAlert: () => void
}

export interface AlertPayload {
  title: string
  description?: string
  type: "default" | "destructive"
  action?: { text: string; callback: () => void }[]
}
