import { useState } from "react"
import { Building2, Plus, Trash2 } from "lucide-react"
import { FiEdit } from "react-icons/fi"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Can,
  ConfirmDialog,
  DataTable,
  DataTableColumnsButton,
  DataTableToolbar,
  EmptyState,
  IconBadge,
  PageHeader,
  Text,
  type Column,
} from "@/components/shared"
import { useDebounce } from "@/hooks/use-debounce"
import { useDepartment } from "@/hooks/data-fetch"
import type { Department } from "@/redux/features/departments"
import { getErrorMessage } from "@/lib/errors"
import { shortId } from "@/lib/format"
import { DepartmentFormModal } from "@/components/modal"

export default function DepartmentListPage() {
  const [search, setSearch] = useState("")
  const debounced = useDebounce(search, 350)

  const {
    departments,
    isFetching,
    isLoading,
    deleteDepartment,
    toggleDepartmentStatus,
  } = useDepartment({ searchTerm: debounced || undefined, limit: 100 })

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Department | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Department | null>(null)

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (d: Department) => {
    setEditing(d)
    setFormOpen(true)
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    try {
      await deleteDepartment(pendingDelete.id).unwrap()
      toast.success("Department deleted")
      setPendingDelete(null)
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete department"))
    }
  }

  const onToggle = async (id: string) => {
    try {
      await toggleDepartmentStatus(id).unwrap()
    } catch {
      toast.error("Failed to update status")
    }
  }

  const columns: Column<Department>[] = [
    {
      key: "name",
      header: "Name",
      cell: (d) => (
        <div className="flex items-center gap-3">
          <IconBadge icon={Building2} />
          <div className="min-w-0">
            <div className="truncate font-medium">{d.name || "Untitled"}</div>
            <Text size="xs" tone="muted">
              {shortId(d.id)}
            </Text>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      hideOnMobile: true,
      cell: (d) => (
        <Text size="sm" tone="muted" className="line-clamp-2">
          {d.description || "—"}
        </Text>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (d) => (
        <Switch
          checked={d.isActive}
          onCheckedChange={() => onToggle(d.id)}
          withLabels
        />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      fixed: "right",
      cell: (d) => (
        <div className="flex justify-end gap-1">
          <Can module="departments" action="update">
            <Button
              size="icon-sm"
              variant="soft"
              onClick={() => openEdit(d)}
              aria-label="Edit"
              className="border border-gray-300"
            >
              <FiEdit />
            </Button>
          </Can>
          <Can module="departments" action="delete">
            <Button
              size="icon-sm"
              variant="soft-destructive"
              onClick={() => setPendingDelete(d)}
              aria-label="Delete"
              className="border border-gray-300"
            >
              <Trash2 />
            </Button>
          </Can>
        </div>
      ),
    },
  ]

  // Toolbar's "Filter Columns" dropdown owns its hidden-set + persists to
  // localStorage keyed by `tableName`. Page just stores the filtered list.
  const [visibleColumns, setVisibleColumns] =
    useState<Column<Department>[]>(columns)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Department List"
        description="Group employees by department for reporting and access scoping."
        actions={
          <Can module="departments" action="create">
            <Button onClick={openCreate}>
              <Plus className="size-4" /> New Department
            </Button>
          </Can>
        }
      />

      <DataTableToolbar
        value={search}
        onChange={setSearch}
        placeholder="Search departments..."
        fetching={isFetching}
        right={
          <DataTableColumnsButton
            tableName="departments"
            columns={columns}
            onVisibleColumnsChange={setVisibleColumns}
          />
        }
      />

      <DataTable<Department>
        data={departments}
        columns={visibleColumns}
        isLoading={isLoading && departments.length === 0}
        isFetching={isFetching}
        empty={
          <EmptyState
            icon={Building2}
            title="No departments yet."
            action={
              <Can module="departments" action="create">
                <Button size="sm" onClick={openCreate}>
                  <Plus className="size-4" /> Create Department
                </Button>
              </Can>
            }
          />
        }
      />

      <DepartmentFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(v) => !v && setPendingDelete(null)}
        title="Delete department?"
        description={`This will permanently remove "${pendingDelete?.name ?? ""}".`}
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
