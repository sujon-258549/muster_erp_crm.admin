import { Image } from "lucide-react"
import { ModulePlaceholder } from "@/components/shared"

export default function MediaLibraryPage() {
  return (
    <ModulePlaceholder
      title="Media Library"
      description="Upload, browse, and manage images and documents."
      icon={Image}
    />
  )
}
