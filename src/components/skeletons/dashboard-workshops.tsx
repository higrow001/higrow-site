import { Skeleton } from "../ui/skeleton"

function DashboardWorkshopSkeleton() {
  return (
    <div className="space-y-12">
      <div className="flex w-full justify-between items-center">
        <Skeleton className="h-10 w-96" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="space-y-4">
        <Skeleton className="w-full h-14" />
        <Skeleton className="w-full h-14" />
        <Skeleton className="w-full h-14" />
      </div>
    </div>
  )
}

export default DashboardWorkshopSkeleton
