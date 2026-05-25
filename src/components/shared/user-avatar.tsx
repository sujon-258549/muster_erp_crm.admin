import { cn } from "@/lib/utils"
import { initialsFromName } from "@/lib/format"

interface UserAvatarProps {
  name?: string | null
  src?: string | null
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  className?: string
  fallbackBg?: string
}

// Initials-fallback avatar. Use it anywhere we render a person — list
// rows, profile chips, comment authors.
export function UserAvatar({
  name,
  src,
  size = "md",
  className,
  fallbackBg,
}: UserAvatarProps) {
  const sizeClass =
    size === "xs"
      ? "size-6 text-[10px]"
      : size === "sm"
        ? "size-7 text-xs"
        : size === "lg"
          ? "size-11 text-base"
          : size === "xl"
            ? "size-14 text-lg"
            : "size-9 text-sm"

  return (
    <span
      data-slot="user-avatar"
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold",
        fallbackBg ?? "bg-primary/10 text-primary",
        sizeClass,
        className,
      )}
      aria-label={name ?? "User"}
    >
      {src ? (
        <img
          src={src}
          alt={name ?? "avatar"}
          className="aspect-square size-full object-cover"
        />
      ) : (
        initialsFromName(name)
      )}
    </span>
  )
}
