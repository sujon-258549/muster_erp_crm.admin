/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"
import { cn } from "@/lib/utils"
import { TableSkeleton } from "@/components/skeleton"

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
  // Hint for responsive behavior. Columns marked `hideOnMobile` get
  // `hidden md:table-cell` so they only render on tablet+ screens. Defaults
  // to false (always visible).
  hideOnMobile?: boolean
  // Pin the column to the right edge while the table scrolls horizontally —
  // mirrors Ant Design's `fixed: 'right'`. Use for action columns so they
  // never scroll out of view.
  fixed?: "right"
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
  // Minimum width of the table itself. The outer wrapper keeps `overflow-x-auto`
  // so on small screens the table scrolls horizontally instead of squishing.
  minWidth?: string
}

// Helpers below take only the primitive fields they need so they don't have
// to mirror DataTable's generic — keeps the call sites simple.
const alignClass = (align: Column<unknown>["align"]) =>
  align === "right" ? "text-right" : align === "center" ? "text-center" : "text-left"

const responsiveClass = (hideOnMobile: boolean | undefined) =>
  hideOnMobile ? "hidden md:table-cell" : ""

// A generic, presentation-only data table. Pages own the data fetching and
// just pass `data` + `columns`. Composable bits like loading, empty state,
// pagination and column-visibility are layered on top via the sibling
// helpers in this folder (DataTableToolbar, DataTablePagination,
// DataTableColumnsButton, useColumnVisibility).
//
// Responsive: the wrapping div is `overflow-x-auto`, the table itself has a
// configurable `min-w` so it doesn't squish on small screens. Columns can
// opt out on mobile with `hideOnMobile: true`.
//
// `T extends Record<string, any>` is intentional — list rows commonly use
// snake_case + camelCase keys and we don't want consumers fighting the
// types. The `any` here is widened, never returned.
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
  minWidth = "640px",
}: DataTableProps<T>) {
  const keyFor = (row: T, index: number) =>
    rowKey ? rowKey(row, index) : ((row.id as string) ?? String(index))

  // Skeleton rows mimic the real table shape — far less jarring than a
  // spinner. Column count derives from the actual columns prop so the
  // ghost matches the eventual layout.
  if (isLoading) {
    return <TableSkeleton columns={columns.length || 5} rows={6} />
  }

  if (data.length === 0 && empty) {
    return <>{empty}</>
  }

  // Single scrollbar — when the table is wider than the card, the card
  // itself scrolls horizontally. No nested overflow regions.
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-md border bg-card text-card-foreground shadow-xs",
        isFetching && "ring-1 ring-primary/10",
        className,
      )}
    >
      <table className="w-full text-sm" style={{ minWidth }}>
        {caption && (
          <caption className="px-4 py-2 text-left text-xs text-muted-foreground">
            {caption}
          </caption>
        )}
        <thead className="border-b border-border/70 text-[11px] uppercase tracking-wider text-muted-foreground">
          <tr className="bg-muted/50">
            {columns.map((col) => (
              <th
                key={col.key}
                style={col.width ? { width: col.width } : undefined}
                className={cn(
                  "px-4 py-3 font-semibold",
                  alignClass(col.align),
                  responsiveClass(col.hideOnMobile),
                  col.fixed === "right" &&
                    "sticky right-0 z-20 bg-muted shadow-[-4px_0_6px_-4px_rgba(0,0,0,0.08)]",
                  col.headerClassName,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {data.map((row, index) => (
            <tr
              key={keyFor(row, index)}
              className={cn(
                "bg-card transition-colors hover:bg-muted",
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
                    responsiveClass(col.hideOnMobile),
                    col.fixed === "right" &&
                      "sticky right-0 z-10 bg-inherit shadow-[-4px_0_6px_-4px_rgba(0,0,0,0.08)]",
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
      {footer}
    </div>
  )
}
