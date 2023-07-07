"use client"
import { useEffect } from "react"

import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { useUser } from "@/states/user"
import OrganizedWorkshops from "@/components/dashboard/org-workshops"

export default function Dashboard() {
  const { initUserData, organizedWorkshops } = useUser()

  async function getUserInContext() {
    const fetchUser = await getDoc(doc(db, "users", auth.currentUser!.uid))
    if (fetchUser.exists()) {
      const userData = fetchUser.data()

      initUserData({
        displayName: userData.display_name,
        id: fetchUser.id,
        email: userData.email,
        profilePhoto: userData.profile_photo,
        organizedWorkshops: userData.organizedWorkshops,
      })
    }
  }

  useEffect(() => {
    if (auth.currentUser) {
      getUserInContext()
    }
  }, [auth.currentUser])

  return (
    <main className="basis-[80%]">
      <h1 className="font-archivo font-medium text-[#333] text-4xl p-20 border-b border-[#333]">
        Welcome to HiGrow. Dashboard.
      </h1>
      <div className="py-12 px-20">
        <OrganizedWorkshops />
      </div>
    </main>
  )
}
