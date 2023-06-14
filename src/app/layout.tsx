import "./globals.css";
import { Public_Sans, Archivo_Black } from "next/font/google";

const publicSans = Public_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-public-sans",
});
const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-archivo-black",
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
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${archivoBlack.variable}`}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
