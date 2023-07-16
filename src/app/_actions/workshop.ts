"use server"

import { getDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function getWorkshop(id: string, givePrivate = false) {
  const fetchData = await getDoc(doc(db, "workshops", id))
  if (fetchData.exists()) {
    if (givePrivate) {
      return { private: fetchData.data().private, ...fetchData.data().public }
    } else {
      return fetchData.data().public
    }
  }
}
