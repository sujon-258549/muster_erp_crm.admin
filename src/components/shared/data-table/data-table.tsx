import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Column<T> {
  key: string
  header: React.ReactNode
  // Render the cell for this row. If omitted the value at row[key as keyof T]
  // is rendered raw.
  cell?: (row: T, index: number) => React.ReactNode
  align?: "left" | "center" | "right"
  width?: string
  className?: string
  headerClassName?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  // Stable key for each row — defaults to `row.id` when present.
  rowKey?: (row: T, index: number) => string
  isLoading?: boolean
  isFetching?: boolean
  empty?: React.ReactNode
  // Hover handler — pages plug click-to-edit here.
  onRowClick?: (row: T) => void
  // Optional footer (used for pagination).
  footer?: React.ReactNode
  className?: string
  caption?: React.ReactNode
}

const alignClass = (align: Column<any>["align"]) =>
  align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"

// A generic, presentation-only data table. Pages own the data fetching and
// just pass `data` + `columns`. Composable bits like loading, empty state
// and footer slots are built-in so list pages stay short.
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  rowKey,
  isLoading,
  isFetching,
  empty,
  onRowClick,
  footer,
  className,
  caption,
}: DataTableProps<T>) {
  const keyFor = (row: T, index: number) =>
    rowKey ? rowKey(row, index) : (row.id as string) ?? String(index)

  if (isLoading) {
    return (
      <div className="grid place-items-center rounded-lg border bg-card py-16 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    )
  }

  if (data.length === 0 && empty) {
    return <>{empty}</>
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border bg-card",
        isFetching && "ring-1 ring-primary/10",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {caption && (
            <caption className="px-4 py-2 text-left text-xs text-muted-foreground">
              {caption}
            </caption>
          )}
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    "px-4 py-3 font-medium",
                    alignClass(col.align),
                    col.headerClassName,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((row, index) => (
              <tr
                key={keyFor(row, index)}
                className={cn(
                  "transition-colors hover:bg-accent/30",
                  onRowClick && "cursor-pointer",
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-3 align-middle",
                      alignClass(col.align),
                      col.className,
                    )}
                  >
                    {col.cell
                      ? col.cell(row, index)
                      : (row[col.key as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footer}
    </div>
  )
}
