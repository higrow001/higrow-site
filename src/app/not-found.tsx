import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function notFound() {
  return (
    <main className="h-full w-full flex justify-center items-center flex-col space-y-8 px-6">
      <h1 className="font-archivo font-bold text-center text-4xl lg:text-6xl">Whoops, that page is Gone.</h1>
      <p className="text-base md:text-xl text-secondary text-center font-medium lg:w-[50ch]">We searched everywhere but couldn't find what you're looking for.
        Let's find a better place for you to go.</p>
      <Link href="/">
        <Button className="px-6 " size={"xl"}>Back to Home</Button>
      </Link>
    </main>
  )
}
