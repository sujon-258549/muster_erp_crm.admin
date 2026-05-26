import PageHeader from "@/components/common/page-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function CustomerListPage() {
  return (
    <div>
      <PageHeader
        title="Customers"
        description="Manage your CRM contacts"
        actions={
          <Button>
            <Plus className="size-4" /> New Customer
          </Button>
        }
      />
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        Customer table goes here.
      </div>
    </div>
  )
}
