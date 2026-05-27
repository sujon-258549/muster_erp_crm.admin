import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface TableSkeletonProps {
  // How many ghost rows to render. Defaults to 6 — fits the typical page
  // size without flashing too much chrome.
  rows?: number
  // How many columns each ghost row should mimic. Try to match the real
  // column count for a believable placeholder.
  columns?: number
  className?: string
}

// Skeleton that mimics a DataTable while data is loading. Renders a card
// with a header row + N empty rows of pulsing bars. Drop in anywhere a
// table is about to show.
export function TableSkeleton({
  rows = 6,
  columns = 5,
  className,
}: TableSkeletonProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border bg-card shadow-xs",
        className,
      )}
    >
      {/* Header row */}
      <div className="flex items-center gap-4 border-b border-border/70 bg-muted/40 px-4 py-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "h-3",
              i === 0 ? "w-32" : i === columns - 1 ? "w-16" : "w-24",
            )}
          />
        ))}
      </div>

      {/* Body rows */}
      <div className="divide-y divide-border/60">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 px-4 py-3">
            {Array.from({ length: columns }).map((_, c) => (
              <div key={c} className="flex flex-1 items-center gap-2">
                {c === 0 && <Skeleton className="size-8 rounded-md" />}
                <Skeleton
                  className={cn(
                    "h-4",
                    c === 0 ? "w-40" : c === columns - 1 ? "w-20" : "w-32",
                  )}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
