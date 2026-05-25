import { useState } from "react"
import { KeyRound, Pencil, Plus, ShieldCheck, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  ConfirmDialog,
  DataTable,
  DataTableToolbar,
  EmptyState,
  IconBadge,
  PageHeader,
  StatusBadge,
  Text,
  type Column,
} from "@/components/shared"
import { useDebounce } from "@/hooks/use-debounce"
import { useRole } from "@/hooks/data-fetch"
import type { Role } from "@/redux/features/roles"
import { getErrorMessage } from "@/lib/errors"
import { shortId } from "@/lib/format"
import { RoleFormModal, RolePermissionModal } from "@/components/modal"

export default function RoleListPage() {
  const [search, setSearch] = useState("")
  const debounced = useDebounce(search, 350)

  const {
    roles,
    isFetching,
    isLoading,
    deleteRole,
    toggleRoleStatus,
  } = useRole({ searchTerm: debounced || undefined, limit: 100 })

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Role | null>(null)
  const [permRole, setPermRole] = useState<Role | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Role | null>(null)

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (r: Role) => {
    setEditing(r)
    setFormOpen(true)
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    try {
      await deleteRole(pendingDelete.id).unwrap()
      toast.success("Role deleted")
      setPendingDelete(null)
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete role"))
    }
  }

  const onToggle = async (id: string) => {
    try {
      await toggleRoleStatus(id).unwrap()
    } catch {
      toast.error("Failed to update status")
    }
  }

  const columns: Column<Role>[] = [
    {
      key: "role",
      header: "Role",
      cell: (r) => (
        <div className="flex items-center gap-3">
          <IconBadge icon={ShieldCheck} />
          <div>
            <div className="font-medium capitalize">
              {r.role?.replace(/_/g, " ").toLowerCase() || "—"}
            </div>
            <Text size="xs" tone="muted">
              {shortId(r.id)}
            </Text>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      cell: (r) => (
        <Text size="sm" tone="muted">
          {r.description || "—"}
        </Text>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (r) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={r.isActive}
            onCheckedChange={() => onToggle(r.id)}
          />
          <StatusBadge tone={r.isActive ? "active" : "inactive"} />
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (r) => (
        <div className="flex justify-end gap-1">
          <Button
            size="sm"
            variant="soft"
            onClick={() => setPermRole(r)}
            title="Manage permissions"
          >
            <KeyRound className="mr-1.5 size-4" /> Permission
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => openEdit(r)}
            aria-label="Edit"
          >
            <Pencil />
          </Button>
          <Button
            size="icon-sm"
            variant="soft-destructive"
            onClick={() => setPendingDelete(r)}
            aria-label="Delete"
          >
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Role List"
        description="Define access roles and assign per-module permissions to each."
        actions={
          <Button onClick={openCreate}>
            <Plus className="mr-2 size-4" /> New Role
          </Button>
        }
      />

      <DataTableToolbar
        value={search}
        onChange={setSearch}
        placeholder="Search roles..."
        fetching={isFetching}
      />

      <DataTable<Role>
        data={roles}
        columns={columns}
        isLoading={isLoading && roles.length === 0}
        isFetching={isFetching}
        empty={
          <EmptyState
            icon={ShieldCheck}
            title="No roles yet."
            action={
              <Button size="sm" onClick={openCreate}>
                <Plus className="mr-1.5 size-4" /> Create Role
              </Button>
            }
          />
        }
      />

      <RoleFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
      />

      <RolePermissionModal
        open={Boolean(permRole)}
        onOpenChange={(v) => !v && setPermRole(null)}
        role={permRole}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(v) => !v && setPendingDelete(null)}
        title="Delete role?"
        description={`This will permanently remove "${pendingDelete?.role ?? ""}".`}
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
