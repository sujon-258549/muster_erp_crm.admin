import { Receipt } from "lucide-react"
import { ModulePlaceholder } from "@/components/shared"

export default function SubscriptionListPage() {
  return (
    <ModulePlaceholder
      title="Subscriptions"
      description="Manage recurring billing plans and active subscriptions."
      icon={Receipt}
    />
  )
}
