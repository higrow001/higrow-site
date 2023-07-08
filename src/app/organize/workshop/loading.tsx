import { Skeleton } from "@/components/ui/skeleton"

function OrgnaizeWorkshopLoading() {
  return (
    <div className="max-w-4xl w-full py-24 space-y-8 mx-auto">
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
