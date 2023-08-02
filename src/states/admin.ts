import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface DataType {
  adminAccess: boolean
  setAdminAccess: (data: boolean) => void
}

export const useAdminAccess = create<DataType>()(
  persist(
    (set) => ({
      adminAccess: false,
      setAdminAccess: (data) => set(() => ({ adminAccess: data })),
    }),
    {
      name: "admin",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
