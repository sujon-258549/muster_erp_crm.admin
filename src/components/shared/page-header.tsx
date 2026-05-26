import type { ReactNode } from "react"
import { Breadcrumb } from "./breadcrumb"
import { H4, Text } from "./heading"

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  // Custom breadcrumb override — pass `false` to hide the auto-generated
  // breadcrumb (e.g. on the login screen). Anything else replaces the
  // default <Breadcrumb /> with your own JSX.
  breadcrumb?: ReactNode | false
}


export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
}: PageHeaderProps) {
  const crumb =
    breadcrumb === false ? null : (breadcrumb ?? <Breadcrumb />)

  return (
    <div className="flex flex-col gap-2 pb-4">
      {crumb}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <H4>{title}</H4>
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
