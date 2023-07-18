import "./globals.scss"
import { Public_Sans, Archivo } from "next/font/google"
import { Metadata } from "next"
import AppAlert from "@/components/custom-alert"
import CookieRefresher from "@/components/cookie-refresher"

const publicSans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-public-sans",
})
const archivoBlack = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
})

export const metadata: Metadata = {
  title: "HiGrow",
  description:
    "A platform where you join or create workshops and online contests.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${archivoBlack.variable}`}
    >
      <body className="font-sans">
        <AppAlert />
        <CookieRefresher />
        {children}
      </body>
    </html>
  )
}
