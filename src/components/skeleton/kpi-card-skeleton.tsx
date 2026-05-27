import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface KpiCardSkeletonProps {
  count?: number
  className?: string
}

// Skeleton for KPI / SummaryCard strip. Renders N gradient-shaped cards
// stacked horizontally; defaults to 4 to match the standard dashboard row.
export function KpiCardSkeleton({
  count = 4,
  className,
}: KpiCardSkeletonProps) {
  return (
    <div
      className={cn(
        "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative h-24 overflow-hidden rounded-md bg-muted/60 p-4 shadow-xs"
        >
          <Skeleton className="h-2.5 w-20" />
          <Skeleton className="mt-3 h-7 w-24" />
          <Skeleton className="mt-2 h-2.5 w-28" />
        </div>
      ))}
    </div>
  )
}
