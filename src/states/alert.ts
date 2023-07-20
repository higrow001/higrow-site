import { create } from "zustand"
import { devtools } from "zustand/middleware"

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
  action?: { text: string; cancelText?: string; callback: () => void }
  clickClose?: { text: string }
}

export const useAlert = create<Alert & AlertActions>()(
  devtools((set, get) => ({
    show: false,
    data: null,
    showAlert: ({ type = "default", ...AlertPayload }) =>
      !get().show &&
      set(() => ({ show: true, data: { type, ...AlertPayload } })),
    hideAlert: () => {
      set({ show: false })
      setTimeout(get().resetAlert, 500)
    },
    showAutoCloseAlert: ({ type = "default", ...AlertPayload }) => {
      if (!get().show) {
        set(() => ({ show: true, data: { type, ...AlertPayload } }))
        setTimeout(get().hideAlert, 2500)
      }
    },
    resetAlert: () => !get().show && set(() => ({ data: null })),
  }))
)
