import { Wrench } from "lucide-react"
import { ModulePlaceholder } from "@/components/shared"

export default function WorkTypeListPage() {
  return (
    <ModulePlaceholder
      title="Work Types"
      description="Manage the types of work an employee or contractor can perform."
      icon={Wrench}
    />
  )
}
