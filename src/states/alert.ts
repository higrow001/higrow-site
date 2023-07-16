import { create } from "zustand"
import { devtools, persist, createJSONStorage } from "zustand/middleware"

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
  devtools(
    persist(
      (set, get) => ({
        show: false,
        data: null,
        showAlert: (payload) =>
          !get().show && set(() => ({ show: true, data: payload })),
        hideAlert: () => {
          set({ show: false })
          setTimeout(get().resetAlert, 500)
        },
        showAutoCloseAlert: (payload) => {
          if (!get().show) {
            set(() => ({ show: true, data: payload }))
            setTimeout(get().hideAlert, 2500)
          }
        },
        resetAlert: () => !get().show && set(() => ({ data: null })),
      }),
      { name: "alert", storage: createJSONStorage(() => sessionStorage) }
    )
  )
)
