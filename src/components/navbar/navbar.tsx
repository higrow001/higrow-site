"use client"
import "./navbar.scss"
import Link from "next/link"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useState } from "react"

const Navbar = () => {
  const [showSignup, setShowSignup] = useState(true)
  onAuthStateChanged(auth, (user) =>
    user ? setShowSignup(false) : setShowSignup(true)
  )
  return (
    <div className="navbar-container">
      <div className="nav-logo">
        <Link href="/">HiGrow.</Link>{" "}
      </div>
      <div className="nav-links">
        <Link href="/contests">Contests</Link>
        <Link href="/workshops">Workshops</Link>
        <Link href="/aboutus">About us</Link>
      </div>
      <div className="nav-buttons">
        <Link className="organize-button" href="/organize">
          {" "}
          <button> Organize</button>{" "}
        </Link>
        {showSignup ? (
          <Link className="signup-button" href="/signup">
            {" "}
            <button> Sign up</button>{" "}
          </Link>
        ) : (
          <Link className="signup-button" href="/dashboard/admin">
            <button>Dashboard</button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Navbar
