"use client"
import { useState, useTransition } from "react"
import { Button } from "../ui/button"
import { addWorkshopToWishlist } from "@/app/_actions/workshop"

export default function WishlistButton({
  workshop_id,
  user_wishlist,
}: {
  workshop_id: string
  user_wishlist: string[]
}) {
  const [isPending, startTransition] = useTransition()
  const [added, setAdded] = useState(false)
  const inWishlist = user_wishlist.includes(workshop_id)
  return (
    <Button
      onClick={() =>
        startTransition(async () => {
          await addWorkshopToWishlist(workshop_id)
          setAdded(true)
        })
      }
      disabled={added || isPending || inWishlist}
      className="w-full text-sm md:text-base"
      size={"xl"}
      variant={"outline"}
    >
      {inWishlist
        ? "Already in wishlist"
        : isPending
        ? "Adding to wishlist..."
        : "Add to wishlist"}
    </Button>
  )
}
