import { FolderTree } from "lucide-react"
import { ModulePlaceholder } from "@/components/shared"

export default function CategoryListPage() {
  return (
    <ModulePlaceholder
      title="Categories"
      description="Group products and services into top-level categories."
      icon={FolderTree}
    />
  )
}
