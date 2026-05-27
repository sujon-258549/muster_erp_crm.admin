import * as React from "react"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"

interface SelectProps {
  value?: string
  onChange?: (value: string) => void
  // Plain `<option>` children — same authoring shape as native <select>.
  // We parse them into Combobox options so every dropdown gets the same
  // searchable picker look across the app.
  children?: React.ReactNode
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
  id?: string
}

// `Select` looks/works like the shared Combobox — searchable popover with
// keyboard nav — but accepts the native `<option>` authoring shape so
// callers don't have to maintain a separate options array.
function Select({
  value,
  onChange,
  children,
  placeholder = "Select...",
  searchPlaceholder,
  emptyText,
  disabled,
  className,
  id,
}: SelectProps) {
  const options = React.useMemo<ComboboxOption[]>(() => {
    const items: ComboboxOption[] = []
    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return
      if (child.type !== "option") return
      const props = child.props as {
        value?: string | number
        children?: React.ReactNode
      }
      const v = props.value ?? ""
      const label =
        typeof props.children === "string" || typeof props.children === "number"
          ? String(props.children)
          : String(v)
      items.push({ value: String(v), label })
    })
    return items
  }, [children])

  return (
    <Combobox
      value={value}
      onChange={(v) => onChange?.(v)}
      options={options}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      emptyText={emptyText}
      disabled={disabled}
      allowClear={false}
      className={className}
      id={id}
    />
  )
}

export { Select }
