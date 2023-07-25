import { Skeleton } from "@/components/ui/skeleton"

export default function loading() {
  return (
    <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-5">
      <Skeleton className="w-full h-44" />
      <Skeleton className="w-full h-44" />
      <Skeleton className="w-full h-44" />
      <Skeleton className="w-full h-44" />
    </div>
  )
}
