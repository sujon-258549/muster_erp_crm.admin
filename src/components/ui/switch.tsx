import { cn } from "@/lib/utils"

interface SwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  id?: string
  className?: string
  "aria-label"?: string
  onLabel?: string
  offLabel?: string
  withLabels?: boolean
}

function Switch({
  checked,
  onCheckedChange,
  disabled,
  id,
  className,
  onLabel = "Active",
  offLabel = "Deactive",
  withLabels = false,
  ...props
}: SwitchProps) {
  if (withLabels) {
    return (
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        onClick={() => onCheckedChange?.(!checked)}
        disabled={disabled}
        className={cn(
          "relative inline-flex h-6 w-18 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-primary" : "bg-muted-foreground/60",
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none absolute text-[9px] font-semibold uppercase tracking-wide text-primary-foreground transition-opacity",
            checked ? "left-1.5 opacity-100" : "left-1.5 opacity-0",
          )}
        >
          {onLabel}
        </span>
        <span
          className={cn(
            "pointer-events-none absolute text-[9px] font-semibold uppercase tracking-wide text-primary-foreground transition-opacity",
            checked ? "right-1.5 opacity-0" : "right-1.5 opacity-100",
          )}
        >
          {offLabel}
        </span>
        <span
          className={cn(
            "pointer-events-none block size-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
            checked ? "translate-x-13" : "translate-x-0.5",
          )}
        />
      </button>
    )
  }

  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      onClick={() => onCheckedChange?.(!checked)}
      disabled={disabled}
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-input",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none block size-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
          checked ? "translate-x-4" : "translate-x-0",
        )}
      />
    </button>
  )
}

export { Switch }
