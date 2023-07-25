import { Skeleton } from "@/components/ui/skeleton"

function OrgnaizeWorkshopLoading() {
  return (
    <div className="max-w-4xl w-full py-12 md:py-24 space-y-8 mx-auto px-4 md:px-0">
      <div className="flex justify-between items-center mb-20">
        <Skeleton className="w-28 h-11" />
        <Skeleton className="w-28 h-11" />
      </div>
      <Skeleton className="w-full h-20" />
      <Skeleton className="w-full h-96" />
    </div>
  )
}

export default OrgnaizeWorkshopLoading
