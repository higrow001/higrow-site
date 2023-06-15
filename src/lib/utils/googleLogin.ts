import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import {
  query,
  where,
  collection,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";

const loginWithGoogle = async () => {
  try {
    const user = await signInWithPopup(auth, googleProvider);
    if (user) {
      const checkUser = query(
        collection(db, "users"),
        where("email", "==", user.user.email)
      );
      const userAvailable = await getDocs(checkUser);
      if (userAvailable.empty) {
        await setDoc(doc(db, "users", user.user.uid), {
          email: user.user.email,
          display_name: user.user.displayName,
          profile_photo: user.user.photoURL,
        });
      }
    }
  } catch (error) {}
};

export default loginWithGoogle;
