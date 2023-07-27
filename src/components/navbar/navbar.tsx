"use client"
import "./navbar.scss"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "../ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const Navbar = () => {
  const [showSignup, setShowSignup] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [mobileNavHeight, setMobileNavHeight] = useState(0)
  const mobileNavRef = useRef<HTMLDivElement>(null)
  const supabase = createClientComponentClient()

  const checkUser = async () => {
    const user = await supabase.auth.getSession()
    user.data.session ? setShowSignup(false) : setShowSignup(true)
  }

  supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_IN") {
      setShowSignup(false)
    }
    if (event === "SIGNED_OUT") {
      setShowSignup(true)
    }
  })

  const heightStyle: React.CSSProperties = {
    "--nav-collapsible-height": `${mobileNavHeight}px`,
  } as any

  useEffect(() => {
    if (mobileNavRef.current) {
      setMobileNavHeight(mobileNavRef.current.scrollHeight)
    }
  }, [mobileNavRef])

  useEffect(() => {
    checkUser()
  }, [])
  return (
    <div className="navbar-container font-archivo">
      <div
        className={`nav-logo transition-none ${
          expanded ? "bg-black !text-white" : ""
        }`}
      >
        <Link href="/">HiGrow.</Link>{" "}
        <Button
          className="lg:hidden hover:bg-transparent hover:text-primary-foreground"
          variant={"ghost"}
          size={"icon"}
          onClick={() => setExpanded(!expanded)}
          aria-label="Menu"
        >
          {expanded ? <X /> : <Menu />}
        </Button>
      </div>
      <div className="nav-links hidden lg:flex">
        <Link href="/workshops">Workshops</Link>
        <Link href="/contests">Contests</Link>
        <Link href="/faqs">FAQs</Link>
        <Link href="/aboutus">Contact</Link>
      </div>
      <div className="nav-buttons hidden lg:flex">
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
          <Link className="signup-button" href="/dashboard/enrolled">
            <button>Dashboard</button>
          </Link>
        )}
      </div>
      <div
        ref={mobileNavRef}
        className={`flex flex-col lg:hidden w-full text-lg justify-start bg-black text-primary-foreground overflow-hidden transition-all ${
          expanded ? "animate-nav-show" : "animate-nav-hide"
        }`}
        style={heightStyle}
      >
        <div className="py-6 space-y-4 flex flex-col border-y border-background px-8">
          {showSignup ? (
            <Link href="/signup">
              <button> Sign up</button>
            </Link>
          ) : (
            <Link href="/dashboard/enrolled">
              <button>Dashboard</button>
            </Link>
          )}
          <Link href="/organize">
            <button> Organize</button>
          </Link>
        </div>
        <div className="py-6 space-y-4 flex flex-col px-8">
          <Link href="/workshops">Workshops</Link>
          <Link href="/contests">Contests</Link>
          <Link href="/faqs">FAQs</Link>
          <Link href="/aboutus">Contact</Link>
        </div>
      </div>
    </div>
  )
}

export default Navbar
