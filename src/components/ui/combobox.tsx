import * as React from "react"
import { Check, ChevronDown, Plus, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ComboboxOption {
  value: string
  label: string
}

export interface ComboboxProps {
  value?: string
  onChange?: (value: string) => void
  options: ComboboxOption[]
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  allowClear?: boolean
  className?: string
  id?: string
  onAddNew?: () => void
  addNewLabel?: string
}

export function Combobox({
  value,
  onChange,
  options,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results",
  disabled,
  allowClear = true,
  className,
  id,
  onAddNew,
  addNewLabel = "Add new",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const rootRef = React.useRef<HTMLDivElement>(null)

  const selected = React.useMemo(
    () => options.find((o) => o.value === value),
    [options, value],
  )

  React.useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const commit = (val: string) => {
    onChange?.(val)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "group flex h-9 w-full items-center justify-between rounded-[6px] border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none",
          "hover:border-ring/60",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "dark:bg-input/30",
          open && "border-ring ring-[3px] ring-ring/50",
        )}
      >
        <span
          className={cn(
            "truncate text-left",
            !selected && "text-muted-foreground",
          )}
        >
          {selected ? selected.label : placeholder}
        </span>
        <span className="ml-2 flex shrink-0 items-center gap-1 text-muted-foreground">
          {allowClear && selected && !disabled && (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Clear"
              onClick={(e) => {
                e.stopPropagation()
                onChange?.("")
              }}
              className="hidden size-4 items-center justify-center rounded-full hover:bg-muted hover:text-foreground group-hover:flex"
            >
              <X className="size-3" />
            </span>
          )}
          <ChevronDown
            className={cn("size-4 transition-transform", open && "rotate-180")}
          />
        </span>
      </button>

      {open && (
        <ComboboxPanel
          options={options}
          selectedValue={value}
          searchPlaceholder={searchPlaceholder}
          emptyText={emptyText}
          onSelect={commit}
          onClose={() => setOpen(false)}
          onAddNew={
            onAddNew
              ? () => {
                  setOpen(false)
                  onAddNew()
                }
              : undefined
          }
          addNewLabel={addNewLabel}
        />
      )}
    </div>
  )
}

// Lives inside the open state — re-mounts each time the dropdown opens, so
// `query`/`highlight` start fresh without needing an effect-driven reset.
function ComboboxPanel({
  options,
  selectedValue,
  searchPlaceholder,
  emptyText,
  onSelect,
  onClose,
  onAddNew,
  addNewLabel,
}: {
  options: ComboboxOption[]
  selectedValue?: string
  searchPlaceholder: string
  emptyText: string
  onSelect: (value: string) => void
  onClose: () => void
  onAddNew?: () => void
  addNewLabel: string
}) {
  const [query, setQuery] = React.useState("")
  const [highlight, setHighlight] = React.useState(0)
  const searchRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, query])

  // Pure DOM side-effect — focus the input once after mount.
  React.useEffect(() => {
    searchRef.current?.focus()
  }, [])

  // Scroll highlighted option into view (pure DOM side-effect).
  React.useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-idx="${highlight}"]`,
    )
    el?.scrollIntoView({ block: "nearest" })
  }, [highlight])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlight((h) => Math.min(h + 1, filtered.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      const opt = filtered[highlight]
      if (opt) onSelect(opt.value)
    } else if (e.key === "Escape") {
      onClose()
    }
  }

  return (
    <div
      className={cn(
        "absolute left-0 right-0 z-50 mt-1 overflow-hidden rounded-[6px] border border-input bg-popover text-popover-foreground shadow-lg",
        "animate-in fade-in-0 zoom-in-95",
      )}
      onKeyDown={handleKeyDown}
    >
      <div className="relative border-b border-input">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={searchRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setHighlight(0)
          }}
          onKeyDown={handleKeyDown}
          placeholder={searchPlaceholder}
          className="h-9 w-full bg-transparent pl-8 pr-3 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div
        ref={listRef}
        role="listbox"
        className="max-h-56 overflow-y-auto py-1"
      >
        {filtered.length === 0 ? (
          <div className="px-3 py-6 text-center text-xs text-muted-foreground">
            {emptyText}
          </div>
        ) : (
          filtered.map((opt, idx) => {
            const isSelected = opt.value === selectedValue
            const isHighlighted = idx === highlight
            return (
              <div
                key={opt.value}
                data-idx={idx}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHighlight(idx)}
                onMouseDown={(e) => {
                  e.preventDefault()
                  onSelect(opt.value)
                }}
                className={cn(
                  "flex cursor-pointer items-center justify-between px-3 py-1.5 text-sm",
                  isHighlighted && "bg-accent text-accent-foreground",
                  isSelected && "font-medium",
                )}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && (
                  <Check className="ml-2 size-4 shrink-0 text-primary" />
                )}
              </div>
            )
          })
        )}
      </div>

      {onAddNew && (
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            onAddNew()
          }}
          className="flex w-full items-center gap-2 border-t border-input px-3 py-2 text-sm text-primary transition-colors hover:bg-accent"
        >
          <Plus className="size-4" /> {addNewLabel}
        </button>
      )}
    </div>
  )
}
