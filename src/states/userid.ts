import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface UserID {
  userid: string | null
}

interface UserIDActions {
  setId: (id: string) => void
  removeId: () => void
}

export const useUserId = create<UserID & UserIDActions>()(
  devtools(
    persist(
      (set) => ({
        userid: "",
        setId: (id) => set(() => ({ userid: id })),
        removeId: () => set(() => ({ userid: null })),
      }),
      { name: "userid" }
    )
  )
)
