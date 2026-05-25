import { Loader2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface DataTableToolbarProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  fetching?: boolean
  right?: React.ReactNode
}

// Search + fetching indicator. Sits above a DataTable. Pages can put filter
// dropdowns into the `right` slot.
export function DataTableToolbar({
  value,
  onChange,
  placeholder = "Search...",
  fetching,
  right,
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex items-center gap-2">
        {fetching && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" /> Refreshing…
          </div>
        )}
        {right}
      </div>
    </div>
  )
}
