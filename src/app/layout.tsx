"use client";

import Navbar from "@/components/navbar/navbar";
import "./globals.scss";
import { Public_Sans, Archivo } from "next/font/google";
import { usePathname } from "next/navigation";

const publicSans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-public-sans",
});
const archivoBlack = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});

export const metadata = {
  title: "HiGrow",
  description: "App providing a platform to host xyz.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const noNav = ["/signin", "/signup"];

  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${archivoBlack.variable}`}
    >
      
      <body className="font-sans">
        {!noNav.includes(pathname) && <Navbar />}
        {children}
      </body>
    </html>
  );
}
