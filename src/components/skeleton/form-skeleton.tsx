import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface FormSkeletonProps {
  fields?: number
  columns?: 1 | 2
  showActions?: boolean
  className?: string
}

// Skeleton for an edit form while the resource is loading. Shows N label
// + input pairs in a 1- or 2-column grid, plus optional footer buttons.
export function FormSkeleton({
  fields = 8,
  columns = 2,
  showActions = true,
  className,
}: FormSkeletonProps) {
  return (
    <div className={cn("space-y-5", className)}>
      <div
        className={cn(
          "grid gap-4",
          columns === 2 && "sm:grid-cols-2",
        )}
      >
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
        ))}
      </div>
      {showActions && (
        <div className="flex justify-end gap-2 border-t border-border/60 pt-4">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-md" />
        </div>
      )}
    </div>
  )
}
