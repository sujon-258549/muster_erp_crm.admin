import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface ListSkeletonProps {
  rows?: number
  hasAvatar?: boolean
  className?: string
}

// Vertical list with avatar + label + sub-label. Good fit for activity
// feeds, top-performer panels, recent items, etc.
export function ListSkeleton({
  rows = 5,
  hasAvatar = true,
  className,
}: ListSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          {hasAvatar && <Skeleton className="size-9 shrink-0 rounded-full" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-2.5 w-1/3" />
          </div>
          <Skeleton className="h-3 w-12 shrink-0" />
        </div>
      ))}
    </div>
  )
}
