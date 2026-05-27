import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface ChartSkeletonProps {
  height?: number
  className?: string
}

// Skeleton for an ApexCharts-style chart card while data loads.
// Renders a header + a tall pulsing area where the canvas would render.
export function ChartSkeleton({
  height = 300,
  className,
}: ChartSkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md border bg-card p-5 shadow-xs",
        className,
      )}
    >
      <div className="mb-4 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-56" />
      </div>
      <Skeleton
        className="w-full rounded-md"
        style={{ height: `${height}px` }}
      />
    </div>
  )
}
