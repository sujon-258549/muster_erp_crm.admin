import { useState } from "react"
import { BadgeCheck, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  ConfirmDialog,
  DataTableToolbar,
  EmptyState,
  IconBadge,
  PageHeader,
  StatusBadge,
  Text,
} from "@/components/shared"
import { useDebounce } from "@/hooks/use-debounce"
import { useDesignation } from "@/hooks/data-fetch"
import type { Designation } from "@/redux/features/designations"
import { getErrorMessage } from "@/lib/errors"
import { DesignationFormModal } from "@/components/modal"

export default function DesignationListPage() {
  const [search, setSearch] = useState("")
  const debounced = useDebounce(search, 350)

  const {
    designations,
    isFetching,
    isLoading,
    deleteDesignation,
    toggleDesignationStatus,
  } = useDesignation({ searchTerm: debounced || undefined, limit: 100 })

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Designation | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Designation | null>(null)

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (d: Designation) => {
    setEditing(d)
    setFormOpen(true)
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    try {
      await deleteDesignation(pendingDelete.id).unwrap()
      toast.success("Designation deleted")
      setPendingDelete(null)
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete designation"))
    }
  }

  const onToggle = async (id: string) => {
    try {
      await toggleDesignationStatus(id).unwrap()
    } catch {
      toast.error("Failed to update status")
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Designation List"
        description="Job titles assigned to employees — e.g. Software Engineer, HR Manager."
        actions={
          <Button onClick={openCreate}>
            <Plus className="mr-2 size-4" /> New Designation
          </Button>
        }
      />

      <DataTableToolbar
        value={search}
        onChange={setSearch}
        placeholder="Search designations..."
        fetching={isFetching}
      />

      {isLoading && designations.length === 0 ? (
        <Card>
          <CardContent className="py-12" />
        </Card>
      ) : designations.length === 0 ? (
        <EmptyState
          icon={BadgeCheck}
          title="No designations yet."
          action={
            <Button size="sm" onClick={openCreate}>
              <Plus className="mr-1.5 size-4" /> Create Designation
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {designations.map((d) => (
            <Card key={d.id}>
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex items-start gap-3">
                    <IconBadge icon={BadgeCheck} />
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{d.name}</h3>
                      {d.description && (
                        <Text size="xs" tone="muted" className="line-clamp-2">
                          {d.description}
                        </Text>
                      )}
                    </div>
                  </div>
                  <StatusBadge tone={d.isActive ? "active" : "inactive"} />
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={d.isActive}
                      onCheckedChange={() => onToggle(d.id)}
                    />
                    <Text size="xs" tone="muted">
                      {d.isActive ? "Enabled" : "Disabled"}
                    </Text>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon-sm"
                      variant="soft"
                      onClick={() => openEdit(d)}
                      aria-label="Edit"
                    >
                      <Pencil />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="soft-destructive"
                      onClick={() => setPendingDelete(d)}
                      aria-label="Delete"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <DesignationFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(v) => !v && setPendingDelete(null)}
        title="Delete designation?"
        description={`This will permanently remove "${pendingDelete?.name ?? ""}".`}
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
