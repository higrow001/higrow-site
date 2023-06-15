"use client";

import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  onAuthStateChanged(auth, (u) => {
    if (u) {
      router.replace("/app");
    }
  });
  return (
    <main>
      <p>Landing Page.</p>
      <Link className="text-theme-blue" href="/signin">
        Sign in
      </Link>
    </main>
  );
}
