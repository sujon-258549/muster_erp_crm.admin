import type { ReactNode } from "react"
import { H2, Text } from "./heading"

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  breadcrumb?: ReactNode
}

// Single page header used by every page. Pages should NOT roll their own
// header markup — extend this component if you need a new slot.
export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 pb-4">
      {breadcrumb}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <H2>{title}</H2>
          {description && (
            <Text size="sm" tone="muted" className="mt-1">
              {description}
            </Text>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}
