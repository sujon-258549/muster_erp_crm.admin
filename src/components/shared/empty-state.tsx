import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Text } from "./heading"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

// Used inside DataTable's `empty` slot and other empty list views.
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
        {Icon && <Icon className="size-10 text-muted-foreground/40" />}
        <Text weight="medium">{title}</Text>
        {description && (
          <Text size="sm" tone="muted">
            {description}
          </Text>
        )}
        {action && <div className="mt-2">{action}</div>}
      </CardContent>
    </Card>
  )
}
