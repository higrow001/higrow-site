import { Skeleton } from "@/components/ui/skeleton"

function Loading() {
  return (
    <div className="max-w-4xl w-full space-y-8 mx-auto">
      <Skeleton className="w-full h-96" />
    </div>
  )
}

export default Loading
