import * as React from "react"
import type { LucideIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Wraps any lucide icon with consistent sizing/tone tokens. Use this instead
// of styling icons inline so size and color choices stay centralized.

const iconVariants = cva("shrink-0", {
  variants: {
    size: {
      xs: "size-3",
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
      xl: "size-8",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      destructive: "text-destructive",
      success: "text-emerald-600 dark:text-emerald-400",
      warning: "text-amber-500",
    },
  },
  defaultVariants: {
    size: "sm",
    tone: "default",
  },
})

interface IconProps
  extends Omit<React.SVGProps<SVGSVGElement>, "ref">,
    VariantProps<typeof iconVariants> {
  as: LucideIcon
}

export function Icon({ as: Component, size, tone, className, ...props }: IconProps) {
  return (
    <Component
      data-slot="icon"
      className={cn(iconVariants({ size, tone }), className)}
      {...props}
    />
  )
}

// Renders an icon inside a soft-tinted square — useful for list/card avatars.
interface IconBadgeProps {
  icon: LucideIcon
  tone?: "primary" | "muted" | "success" | "warning" | "destructive"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function IconBadge({
  icon: IconComp,
  tone = "primary",
  size = "md",
  className,
}: IconBadgeProps) {
  return (
    <div
      data-slot="icon-badge"
      className={cn(
        "grid place-items-center rounded-md",
        size === "sm" && "size-7 [&_svg]:size-3.5",
        size === "md" && "size-8 [&_svg]:size-4",
        size === "lg" && "size-10 [&_svg]:size-5",
        tone === "primary" && "bg-primary/10 text-primary",
        tone === "muted" && "bg-muted text-muted-foreground",
        tone === "success" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        tone === "warning" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        tone === "destructive" && "bg-destructive/10 text-destructive",
        className,
      )}
    >
      <IconComp />
    </div>
  )
}
