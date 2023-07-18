import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider, db } from "../firebase"
import {
  query,
  where,
  collection,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore"
import { useRouter, useSearchParams } from "next/navigation"

const useGoogleLogin = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get("redirect")

  const loginWithGoogle = async () => {
    try {
      const user = await signInWithPopup(auth, googleProvider)
      if (user) {
        const checkUser = query(
          collection(db, "users"),
          where("email", "==", user.user.email)
        )
        const userAvailable = await getDocs(checkUser)
        if (userAvailable.empty) {
          await setDoc(doc(db, "users", user.user.uid), {
            email: user.user.email,
            display_name: user.user.displayName,
            profile_photo: user.user.photoURL,
            organized_workshops: [],
            organized_contests: [],
            participated_workshops: [],
            participated_contests: [],
          })
          document.cookie = `display_name=${
            user.user.displayName
          }; SameSite=Lax; max-age=${60 * 60 * 24 * 30}`
        } else {
          document.cookie = `display_name=${
            userAvailable.docs[0].data().display_name
          }; SameSite=Lax; max-age=${60 * 60 * 24 * 30}`
        }
        document.cookie = `uid=${user.user.uid}; SameSite=Lax; max-age=${
          60 * 60 * 24 * 30
        }`
        document.cookie = `email=${user.user.email}; SameSite=Lax; max-age=${
          60 * 60 * 24 * 30
        }`
        router.replace(`/${redirectPath ?? ""}`)
      }
    } catch (error) {}
  }

  return loginWithGoogle
}

export default useGoogleLogin
