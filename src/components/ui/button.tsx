import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

// Button variants are kept here as the single source of truth — every
// button in the app should compose these. Add new visual styles by adding
// a `variant` entry rather than re-styling buttons inline.
const buttonVariants = cva(
  // `gap-1.5` is the single source of truth for the space between an icon
  // and its label. Pages should NOT add `mr-2` to icons inside buttons —
  // the gap utility handles it consistently across every button variant.
  "inline-flex shrink-0 items-center justify-center gap-1.5 text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        // Soft tinted variants — useful for action buttons in tables and
        // detail panes where a solid primary would feel too heavy.
        soft: "bg-primary/10 text-primary hover:bg-primary/15",
        "soft-destructive":
          "bg-destructive/10 text-destructive hover:bg-destructive/15",
        "soft-success":
          "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 dark:text-emerald-400",
        "soft-warning":
          "bg-amber-500/10 text-amber-600 hover:bg-amber-500/15 dark:text-amber-400",
        success:
          "bg-emerald-600 text-white hover:bg-emerald-600/90 focus-visible:ring-emerald-600/30",
        warning:
          "bg-amber-500 text-white hover:bg-amber-500/90 focus-visible:ring-amber-500/30",
      },
      // Corner radius — `rounded` is the default app style, `pill` is for
      // chip-like CTAs, `square` for icon-grouped toolbars.
      shape: {
        rounded: "rounded-[6px]",
        pill: "rounded-full",
        square: "rounded-none",
      },
      size: {
        default: "h-8 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      shape: "rounded",
      size: "default",
    },
  },
)

function Button({
  className,
  variant = "default",
  shape = "rounded",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-shape={shape}
      data-size={size}
      className={cn(buttonVariants({ variant, shape, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
