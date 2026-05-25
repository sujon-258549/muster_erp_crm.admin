import PageHeader from "@/components/common/page-header"

export default function ProductListPage() {
  return (
    <div>
      <PageHeader title="Products" description="Manage your inventory items" />
      <div className="rounded-lg border p-6 text-sm text-muted-foreground">
        Product table goes here.
      </div>
    </div>
  )
}
