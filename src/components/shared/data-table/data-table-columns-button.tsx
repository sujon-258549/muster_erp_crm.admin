import { useEffect, useRef, useState } from "react"
import { SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Column } from "./data-table"

interface DataTableColumnsButtonProps<T> {
  // Unique name for this table. Used as the localStorage namespace so each
  // table remembers its own visible columns across page reloads.
  tableName: string
  // Full column list (visible + hidden).
  columns: Column<T>[]
  // Fired whenever the visible-column set changes. Wire to your page state
  // and forward to <DataTable columns={...} />.
  onVisibleColumnsChange?: (visibleColumns: Column<T>[]) => void
  buttonLabel?: string
}

const storageKey = (tableName: string) => `table_columns_${tableName}`

// "Columns" dropdown with localStorage persistence + Select All.
//
// IMPORTANT: parent notification happens synchronously inside the toggle
// handlers (and once at mount during hydration), NOT via a useEffect that
// depends on `columns`. Pages typically rebuild the `columns` array on every
// render — using it as an effect dep would fire on every render and create
// an infinite setState loop, which can block route navigation entirely.
//
//   <DataTableColumnsButton
//     tableName="employees"
//     columns={columns}
//     onVisibleColumnsChange={setVisibleColumns}
//   />
export function DataTableColumnsButton<T>({
  tableName,
  columns,
  onVisibleColumnsChange,
  buttonLabel = "Filter Columns",
}: DataTableColumnsButtonProps<T>) {
  // Keep latest `columns` + `onVisibleColumnsChange` in refs so the
  // toggle helpers can read them without forcing themselves into the
  // dependency list of any hook below.
  const columnsRef = useRef(columns)
  columnsRef.current = columns
  const notifyRef = useRef(onVisibleColumnsChange)
  notifyRef.current = onVisibleColumnsChange

  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  // ── Hydration: load saved keys (or default to all visible) on mount.
  //    Runs once. We notify the parent synchronously here so the initial
  //    render already shows the right column set.
  useEffect(() => {
    const cols = columnsRef.current
    if (!cols.length) return

    const allKeys = cols.map((c) => c.key)
    const raw =
      typeof window !== "undefined"
        ? window.localStorage.getItem(storageKey(tableName))
        : null

    let next: string[] = allKeys
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as unknown
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(
            (k): k is string =>
              typeof k === "string" && allKeys.includes(k),
          )
          next = valid.length ? valid : allKeys
          // Stale keys from removed columns get pruned automatically.
          if (valid.length !== parsed.length) {
            window.localStorage.setItem(
              storageKey(tableName),
              JSON.stringify(next),
            )
          }
        }
      } catch {
        // Bad JSON — fall through to defaults.
      }
    } else if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey(tableName), JSON.stringify(next))
    }

    setSelectedKeys(next)
    // Initial sync with parent.
    notifyRef.current?.(cols.filter((c) => next.includes(c.key)))
    // Mount-only — `tableName` is treated as a constant per table.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Persist + notify in one shot. Synchronous notification means the page
  // never re-renders us mid-loop.
  const persist = (keys: string[]) => {
    setSelectedKeys(keys)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey(tableName), JSON.stringify(keys))
    }
    const cols = columnsRef.current
    notifyRef.current?.(cols.filter((c) => keys.includes(c.key)))
  }

  const toggleKey = (key: string) => {
    persist(
      selectedKeys.includes(key)
        ? selectedKeys.filter((k) => k !== key)
        : [...selectedKeys, key],
    )
  }

  const toggleAll = () => {
    persist(
      selectedKeys.length === columns.length
        ? []
        : columns.map((c) => c.key),
    )
  }

  // Tri-state for the master checkbox.
  const allChecked = selectedKeys.length === columns.length
  const noneChecked = selectedKeys.length === 0
  const masterState: boolean | "indeterminate" = allChecked
    ? true
    : noneChecked
      ? false
      : "indeterminate"

  const hiddenCount = columns.length - selectedKeys.length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          <SlidersHorizontal />
          {buttonLabel}
          {hiddenCount > 0 && (
            <span className="ml-1 rounded-sm bg-primary px-1.5 text-[10px] font-semibold text-white">
              {hiddenCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 p-1">
        <DropdownMenuLabel className="px-2 py-1.5 text-xs uppercase tracking-wide text-muted-foreground">
          Visible columns
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Master "Select All" — tri-state checkbox shows a horizontal
            bar when only some columns are selected. */}
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault()
            toggleAll()
          }}
          className="flex cursor-pointer items-center gap-2.5 px-2 py-1.5 text-sm font-medium"
        >
          <Checkbox
            checked={masterState}
            onCheckedChange={() => undefined}
            className="pointer-events-none"
          />
          <span className="flex-1">Select all</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {columns.map((col) => {
          const isVisible = selectedKeys.includes(col.key)
          const label =
            typeof col.header === "string" || typeof col.header === "number"
              ? col.header
              : col.key
          return (
            <DropdownMenuItem
              key={col.key}
              // `onSelect` fires on click + keyboard activation.
              // `preventDefault()` keeps the menu open while flipping
              // multiple columns.
              onSelect={(e) => {
                e.preventDefault()
                toggleKey(col.key)
              }}
              className="flex cursor-pointer items-center gap-2.5 px-2 py-1.5 text-sm"
            >
              <Checkbox
                checked={isVisible}
                // Row's `onSelect` is the source of truth — checkbox is
                // purely visual.
                onCheckedChange={() => undefined}
                className="pointer-events-none"
              />
              <span className="flex-1">{label}</span>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
