import { Skeleton } from "@/components/ui/skeleton"

export default function loading() {
  return (
    <div>
      <Skeleton className="w-full h-36 rounded-none" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-items-center py-16 gap-8 xl:gap-16 px-8 md:px-12">
        <Skeleton className="max-w-[400px] w-full h-[32rem]" />
        <Skeleton className="max-w-[400px] w-full h-[32rem]" />
        <Skeleton className="max-w-[400px] w-full h-[32rem]" />
      </div>
    </div>
  )
}
