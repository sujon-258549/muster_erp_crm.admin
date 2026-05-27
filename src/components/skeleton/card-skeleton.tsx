import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface CardSkeletonProps {
  // Optional content shape — choose the most common layout this skeleton
  // is replacing.
  lines?: number
  hasHeader?: boolean
  className?: string
}

// Generic card-shaped skeleton — header strip + N body lines. Use for any
// content panel that hasn't loaded yet.
export function CardSkeleton({
  lines = 4,
  hasHeader = true,
  className,
}: CardSkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md border bg-card p-5 shadow-xs",
        className,
      )}
    >
      {hasHeader && (
        <div className="mb-4 space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-64" />
        </div>
      )}
      <div className="space-y-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "h-3",
              i === lines - 1 ? "w-3/5" : i % 2 === 0 ? "w-full" : "w-5/6",
            )}
          />
        ))}
      </div>
    </div>
  )
}
