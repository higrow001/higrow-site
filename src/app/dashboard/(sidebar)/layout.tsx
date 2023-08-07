"use client"
import { Button } from "@/components/ui/button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Menu } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useRef, useState } from "react"

interface TouchData {
  initialX: number | null
  initialY: number | null
  x: number | null
}

function isDifferenceGt(
  num1: number,
  num2: number,
  threshold: number,
  sign?: "positive" | "negetive"
) {
  if (sign === "positive") {
    return num1 - num2 >= threshold
  }

  if (sign === "negetive") {
    return num1 - num2 <= threshold
  }

  const difference = Math.abs(num1 - num2)
  return difference >= threshold
}

export default function SideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [touchData, setTouchData] = useState<TouchData>({
    initialX: null,
    initialY: null,
    x: null,
  })
  const sideNav = useRef<HTMLElement>(null)
  const backdrop = useRef<HTMLDivElement>(null)
  const sideNavElement = sideNav.current
  const backdropElement = backdrop.current

  const hideSideNav = () => {
    if (sideNavElement && backdropElement) {
      sideNavElement.animate(
        {
          transform: `translateX(0)`,
        },
        { duration: 200, fill: "forwards", easing: "ease" }
      )
      backdropElement.animate(
        {
          opacity: 0,
          pointerEvents: "none",
        },
        { duration: 200, fill: "forwards" }
      )
    }
  }

  const finishSwipe = (touchX: number, touchY: number) => {
    if (sideNavElement && backdropElement) {
      const width = sideNavElement.clientWidth
      if (
        touchData.initialY &&
        touchData.initialX &&
        isDifferenceGt(touchX, touchData.initialX, 50, "positive") &&
        !isDifferenceGt(touchY, touchData.initialY, 50)
      ) {
        sideNavElement.animate(
          {
            transform: `translateX(${width}px)`,
          },
          {
            duration: 400,
            fill: "forwards",
            easing: "ease",
          }
        )
        backdropElement.animate(
          {
            opacity: 1,
            pointerEvents: "auto",
          },
          {
            duration: 400,
            fill: "forwards",
          }
        )
      }
      if (
        touchData.initialX &&
        isDifferenceGt(touchX, touchData.initialX, 50, "negetive")
      )
        hideSideNav()
    }
  }

  return (
    <div
      className="flex h-full"
      onTouchStart={(e) => {
        setTouchData({
          initialX: e.touches[0].pageX,
          initialY: e.touches[0].pageY,
          x: null,
        })
      }}
      onTouchMove={(e) => {
        setTouchData({
          ...touchData,
          x: e.touches[0].pageX,
        })
        if (
          sideNavElement &&
          backdropElement &&
          touchData.x &&
          touchData.initialX &&
          touchData.initialY
        ) {
          if (
            isDifferenceGt(
              e.touches[0].pageX,
              touchData.initialX,
              75,
              "positive"
            ) &&
            !isDifferenceGt(e.touches[0].pageY, touchData.initialY, 50)
          ) {
            sideNavElement.animate(
              {
                transform: `translateX(${
                  touchData.x >= 0
                    ? touchData.x <= sideNavElement.clientWidth
                      ? touchData.x
                      : sideNavElement.clientWidth
                    : 0
                }px)`,
              },
              {
                duration: 500,
                fill: "forwards",
                easing: "ease",
              }
            )
            backdropElement.animate(
              {
                opacity: touchData.x / sideNavElement.clientWidth,
                pointerEvents:
                  touchData.x / sideNavElement.clientWidth > 0
                    ? "auto"
                    : "none",
              },
              {
                duration: 500,
                fill: "forwards",
                easing: "ease",
              }
            )
          }
        }
      }}
      onTouchEnd={(e) => {
        if (touchData.initialX) {
          setTouchData({
            ...touchData,
            x: e.changedTouches[0].pageX,
          })
          if (isDifferenceGt(e.changedTouches[0].pageX, touchData.initialX, 75))
            finishSwipe(e.changedTouches[0].pageX, e.changedTouches[0].pageY)
        }
      }}
    >
      <div
        onClick={hideSideNav}
        ref={backdrop}
        className="fixed inset-0 z-10 bg-black/70 opacity-0 pointer-events-none"
      ></div>
      <aside
        ref={sideNav}
        className="lg:basis-[30%] xl:basis-[25%] 2xl:basis-[20%] max-lg:fixed max-lg:-left-[80%] lg:relative bg-secondary h-full flex flex-col justify-between text-white max-lg:max-w-[80%] w-full translate-x-0 z-20"
      >
        <div className="flex flex-col">
          <h1 className="font-archivo font-black text-4xl px-12 py-20 border-b border-[#757575]">
            <Link href="/" onClick={hideSideNav}>
              {" "}
              HiGrow.
            </Link>{" "}
          </h1>

          <Link
            href="/dashboard/enrolled"
            className={`"text-lg py-6 px-12 border-b border-[#757575] transition ${
              pathname.includes("enrolled")
                ? "bg-secondary-darker"
                : "hover:bg-secondary-darker"
            }`}
            onClick={hideSideNav}
          >
            Enrolled
          </Link>
          <Link
            href="/dashboard/admin"
            className={`"text-lg py-6 px-12 border-b border-[#757575] transition ${
              pathname.includes("admin")
                ? "bg-secondary-darker"
                : "hover:bg-secondary-darker"
            }`}
            onClick={hideSideNav}
          >
            Organized
          </Link>
          <Link
            href="/dashboard/wishlist"
            className={`"text-lg py-6 px-12 border-b border-[#757575] transition ${
              pathname.includes("admin")
                ? "bg-secondary-darker"
                : "hover:bg-secondary-darker"
            }`}
            onClick={hideSideNav}
          >
            Wishlist
          </Link>
        </div>
        <div className="flex flex-col">
          <button
            className="text-lg py-6 px-12 border-t text-start border-[#757575] hover:bg-[#2c2c2c] transition"
            onClick={async () => {
              await supabase.auth.signOut()
              router.push("/")
            }}
          >
            Log Out
          </button>
        </div>
      </aside>
      <main className="lg:basis-[70%] xl:basis-[75%] 2xl:basis-[80%] max-lg:w-full overflow-y-auto">
        <div className="lg:hidden w-full p-8 flex items-center justify-between">
          <h1 className="text-3xl font-archivo font-black">HiGrow</h1>
          <Button
            onClick={() => {
              if (sideNavElement && backdropElement) {
                sideNavElement.animate(
                  {
                    transform: `translateX(${sideNavElement.clientWidth}px)`,
                  },
                  {
                    duration: 400,
                    fill: "forwards",
                    easing: "ease",
                  }
                )
                backdropElement.animate(
                  {
                    opacity: 1,
                    pointerEvents: "auto",
                  },
                  { duration: 400, fill: "forwards" }
                )
              }
            }}
            variant={"outline"}
            size={"icon"}
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
        {children}
      </main>
    </div>
  )
}
