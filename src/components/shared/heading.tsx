import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Typography component. Use Heading directly with `as` / `size`, or the
// shorthand H1–H6 exports below for the common case where the heading
// level matches the visual size.

const headingVariants = cva("font-semibold tracking-tight text-foreground", {
  variants: {
    size: {
      h1: "text-3xl sm:text-4xl",
      h2: "text-2xl sm:text-3xl",
      h3: "text-xl sm:text-2xl",
      h4: "text-lg sm:text-xl",
      h5: "text-base sm:text-lg",
      h6: "text-sm sm:text-base",
    },
    weight: {
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      destructive: "text-destructive",
    },
  },
  defaultVariants: {
    size: "h2",
    weight: "semibold",
    tone: "default",
  },
})

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6"

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: HeadingLevel
}

export function Heading({
  as = "h2",
  size,
  weight,
  tone,
  className,
  ...props
}: HeadingProps) {
  const Tag = as
  return (
    <Tag
      data-slot="heading"
      className={cn(headingVariants({ size: size ?? as, weight, tone }), className)}
      {...props}
    />
  )
}

export const H1 = (p: Omit<HeadingProps, "as">) => <Heading as="h1" {...p} />
export const H2 = (p: Omit<HeadingProps, "as">) => <Heading as="h2" {...p} />
export const H3 = (p: Omit<HeadingProps, "as">) => <Heading as="h3" {...p} />
export const H4 = (p: Omit<HeadingProps, "as">) => <Heading as="h4" {...p} />
export const H5 = (p: Omit<HeadingProps, "as">) => <Heading as="h5" {...p} />
export const H6 = (p: Omit<HeadingProps, "as">) => <Heading as="h6" {...p} />

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: "xs" | "sm" | "base" | "lg"
  tone?: "default" | "muted" | "primary" | "destructive" | "success"
  weight?: "regular" | "medium" | "semibold" | "bold"
}

export function Text({
  size = "sm",
  tone = "default",
  weight = "regular",
  className,
  ...props
}: TextProps) {
  return (
    <p
      data-slot="text"
      className={cn(
        size === "xs" && "text-xs",
        size === "sm" && "text-sm",
        size === "base" && "text-base",
        size === "lg" && "text-lg",
        tone === "default" && "text-foreground",
        tone === "muted" && "text-muted-foreground",
        tone === "primary" && "text-primary",
        tone === "destructive" && "text-destructive",
        tone === "success" && "text-emerald-600 dark:text-emerald-400",
        weight === "regular" && "font-normal",
        weight === "medium" && "font-medium",
        weight === "semibold" && "font-semibold",
        weight === "bold" && "font-bold",
        className,
      )}
      {...props}
    />
  )
}
