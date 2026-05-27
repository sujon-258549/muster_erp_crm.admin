import type { LucideIcon } from "lucide-react"
import { PageHeader } from "./page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Text } from "./heading"

// Reusable scaffold for modules whose backend is wired but the UI is not
// fully built yet. Provides consistent title/header/empty state so links
// from the sidebar don't dead-end on a blank page.
export function ModulePlaceholder({
  title,
  description,
  icon: Icon,
}: {
  title: string
  description: string
  icon: LucideIcon
}) {
  return (
    <div className="space-y-5">
      <PageHeader title={title} description={description} />
      <Card>
        <CardContent className="grid place-items-center py-16 text-center">
          <div className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
            <Icon className="size-7" />
          </div>
          <h3 className="mt-3 text-lg font-semibold">{title}</h3>
          <Text size="sm" tone="muted" className="mt-1 max-w-md">
            Backend is ready. The list + form UI for {title.toLowerCase()} is
            scheduled — connect via the matching RTK Query feature in
            <code className="mx-1 rounded bg-muted px-1.5 py-0.5 text-xs">
              src/redux/features/
            </code>
            when you build it.
          </Text>
        </CardContent>
      </Card>
    </div>
  )
}
