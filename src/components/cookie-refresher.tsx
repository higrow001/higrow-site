"use client"
import { useEffect } from "react"
import { auth } from "@/lib/firebase"

export default function CookieRefresher() {
  useEffect(() => {
    if (auth.currentUser) {
      document.cookie = `uid=${auth.currentUser.uid}; SameSite=Lax; max-age=${
        60 * 60 * 24 * 30
      }`
    }
  }, [auth.currentUser])

  return <></>
}
