import { FolderTree } from "lucide-react"
import { ModulePlaceholder } from "@/components/shared"

export default function SubCategoryListPage() {
  return (
    <ModulePlaceholder
      title="Sub Categories"
      description="Nested categories that belong to a parent category."
      icon={FolderTree}
    />
  )
}
