import { create } from "zustand"

interface DataType {
  adminAccess: boolean
  setAdminAccess: (data: boolean) => void
}

export const useAdminAccess = create<DataType>((set) => ({
  adminAccess: false,
  setAdminAccess: (data) => set(() => ({ adminAccess: data })),
}))
