import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"
import { Check, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

// shadcn-style Checkbox built on Radix's accessible primitive. Get full
// a11y (role, aria-checked, keyboard handling, indeterminate state) for
// free. Supports tri-state:
//
//   <Checkbox checked={true}  onCheckedChange={set} />   // ✓
//   <Checkbox checked={false} onCheckedChange={set} />   // empty
//   <Checkbox checked="indeterminate" />                 // ─ (partial)
function Checkbox({
  className,
  checked,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  const isIndeterminate = checked === "indeterminate"

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      checked={checked}
      className={cn(
        // `rounded-[4px]` pins corner radius to exactly 4px — the global
        // `--radius` token resolves higher in this theme.
        // `data-[state=*]:text-white` keeps the icon white regardless of
        // how `primary-foreground` is themed.
        "peer size-4 shrink-0 rounded-[4px] border border-input bg-background outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "hover:border-primary/50",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white",
        "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-white",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        {isIndeterminate ? (
          <Minus className="size-3" strokeWidth={3} />
        ) : (
          <Check className="size-3" strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
