"use client"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"

export default function SignOutBtn({ style }: { style: string }) {
  const router = useRouter()
  return (
    <button
      className={style}
      onClick={() => {
        document.cookie = "uid=done; max-age=0"
        signOut(auth)
        router.push("/")
      }}
    >
      Log Out
    </button>
  )
}
