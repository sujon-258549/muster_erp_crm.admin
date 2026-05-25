import PageHeader from "@/components/common/page-header"

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Workspace preferences and integrations" />
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        Settings form goes here.
      </div>
    </div>
  )
}
