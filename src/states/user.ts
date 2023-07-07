import { User, UserActions } from "@/lib/types"
import { create } from "zustand"
import { devtools, persist, createJSONStorage } from "zustand/middleware"

export const useUser = create<User & UserActions>()(
  devtools(
    persist(
      (set) => ({
        displayName: "",
        email: "",
        id: "",
        profilePhoto: null,
        organizedWorkshops: [],
        initUserData: (data) => set(() => data),
      }),
      { name: "user", storage: createJSONStorage(() => sessionStorage) }
    )
  )
)
