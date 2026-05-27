import { Bell } from "lucide-react"
import { ModulePlaceholder } from "@/components/shared"

export default function NotificationListPage() {
  return (
    <ModulePlaceholder
      title="Notifications"
      description="System and user notifications history."
      icon={Bell}
    />
  )
}
