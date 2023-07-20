"use server"
import { cookies } from "next/headers"
import {
  getDoc,
  doc,
  getDocs,
  query,
  collection,
  where,
  documentId,
  limit,
  Timestamp,
  addDoc,
  orderBy,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  Announcement,
  Participant,
  PrivateWorkshopData,
  PublicWorkshopData,
  TimestampType,
} from "@/lib/types"

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

export async function getUser() {
  const cookieStore = cookies()
  const uid = cookieStore.get("uid")
  if (uid) {
    const user = await getDoc(doc(db, "users", uid.value))
    if (user.exists()) {
      const data = user.data()
      return data
    }
  }
}

type Data = PublicWorkshopData & { id: string }

export async function getUserOrganizedWorkshops() {
  const userData = await getUser()

  if (userData) {
    const ids = userData.organized_workshops
    const allShops: Data[] = []
    try {
      const shops = await getDocs(
        query(
          collection(db, "workshops"),
          where(documentId(), "in", ids),
          limit(3)
        )
      )
      if (!shops.empty) {
        shops.docs.forEach((doc) => {
          allShops.push({ id: doc.id, ...doc.data().public })
        })
      }
      return allShops
    } catch (error) {
      return allShops
    }
  }
}

export async function getParticipatedWorkshops() {
  const userData = await getUser()

  if (userData) {
    const ids = userData.participated_workshops
    const allShops: Data[] = []
    try {
      const shops = await getDocs(
        query(
          collection(db, "workshops"),
          where(documentId(), "in", ids),
          limit(3)
        )
      )
      if (!shops.empty) {
        shops.docs.forEach((doc) => {
          allShops.push({ id: doc.id, ...doc.data().public })
        })
      }
      return allShops
    } catch (error) {
      return allShops
    }
  }
}

export async function requestWorkshop(workshop_id: string) {
  const cookieStore = cookies()
  const user_display_name = cookieStore.get("display_name")
  const user_email = cookieStore.get("email")
  await addDoc(
    collection(db, "workshops", workshop_id, "requested_participants"),
    {
      name: user_display_name?.value,
      email: user_email?.value,
      application_date: Timestamp.now(),
    }
  )
}

export async function joinWorkshop(workshop_id: string) {
  const cookieStore = cookies()
  const user_display_name = cookieStore.get("display_name")
  const user_email = cookieStore.get("email")
  await addDoc(collection(db, "workshops", workshop_id, "participants"), {
    name: user_display_name?.value,
    email: user_email?.value,
    application_date: Timestamp.now(),
  })
}

export async function getAnnouncements(workshop_id: string) {
  let anns: Announcement[] = []
  const fetchData = await getDocs(
    query(
      collection(db, "workshops", workshop_id, "announcements"),
      orderBy("timestamp", "desc")
    )
  )
  if (!fetchData.empty) {
    fetchData.forEach((doc) => {
      anns.push({
        id: doc.id,
        timestamp: doc.data().timestamp,
        title: doc.data().title,
        message: doc.data().message,
      })
    })
  }
  return anns
}

export async function getParticipants(workshop_id: string) {
  let parts: Participant[] = []
  let req_parts: Participant[] = []
  const { is_paid }: PublicWorkshopData = await getWorkshop(workshop_id)
  const participants = await getDocs(
    query(
      collection(db, "workshops", workshop_id, "participants"),
      orderBy("application_date", "desc")
    )
  )
  if (!participants.empty) {
    participants.forEach((part) => {
      if (part.exists()) {
        parts.push({ id: part.id, ...(part.data() as Omit<Participant, "id">) })
      }
    })
  }
  const requested_participants = await getDocs(
    query(
      collection(db, "workshops", workshop_id, "requested_participants"),
      orderBy("application_date", "desc")
    )
  )
  if (!requested_participants.empty) {
    requested_participants.forEach((part) => {
      if (part.exists()) {
        req_parts.push({
          id: part.id,
          ...(part.data() as Omit<Participant, "id">),
        })
      }
    })
  }

  return {
    is_paid,
    participants: parts,
    requested_participants: req_parts,
  }
}
