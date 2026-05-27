import { useState } from "react"
import { KeyRound, Plus, ShieldCheck, Trash2 } from "lucide-react"
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
import { useRole } from "@/hooks/data-fetch"
import type { Role } from "@/redux/features/roles"
import { getErrorMessage } from "@/lib/errors"
import { shortId } from "@/lib/format"
import { RoleFormModal, RolePermissionModal } from "@/components/modal"

export default function RoleListPage() {
  const [search, setSearch] = useState("")
  const debounced = useDebounce(search, 350)

  const {
    roles: rawRoles,
    isFetching,
    isLoading,
    deleteRole,
    toggleRoleStatus,
  } = useRole({ searchTerm: debounced || undefined, limit: 100 })

  // Hide the bootstrap SUPER_ADMIN role from the management table — it's
  // a system role and shouldn't be editable/deletable from the UI.
  const roles = rawRoles.filter(
    (r) => (r.role ?? "").toUpperCase() !== "SUPER_ADMIN",
  )

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
      hideOnMobile: true,
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
        <Switch
          checked={r.isActive}
          onCheckedChange={() => onToggle(r.id)}
          withLabels
        />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      fixed: "right",
      cell: (r) => (
        <div className="flex justify-end gap-1">
          <Can module="roles" action="permission">
            <Button
              size="icon-sm"
              variant="soft"
              onClick={() => setPermRole(r)}
              aria-label="Manage permissions"
              title="Manage permissions"
              className="border border-gray-300"
            >
              <KeyRound />
            </Button>
          </Can>
          <Can module="roles" action="update">
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => openEdit(r)}
              aria-label="Edit"
              className="border border-gray-300"
            >
              <FiEdit />
            </Button>
          </Can>
          <Can module="roles" action="delete">
            <Button
              size="icon-sm"
              variant="soft-destructive"
              onClick={() => setPendingDelete(r)}
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
    useState<Column<Role>[]>(columns)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Role List"
        description="Define access roles and assign per-module permissions to each."
        actions={
          <Can module="roles" action="create">
            <Button onClick={openCreate}>
              <Plus className="size-4" /> New Role
            </Button>
          </Can>
        }
      />

      <DataTableToolbar
        value={search}
        onChange={setSearch}
        placeholder="Search roles..."
        fetching={isFetching}
        right={
          <DataTableColumnsButton
            tableName="roles"
            columns={columns}
            onVisibleColumnsChange={setVisibleColumns}
          />
        }
      />

      <DataTable<Role>
        data={roles}
        columns={visibleColumns}
        isLoading={isLoading && roles.length === 0}
        isFetching={isFetching}
        empty={
          <EmptyState
            icon={ShieldCheck}
            title="No roles yet."
            action={
              <Can module="roles" action="create">
                <Button size="sm" onClick={openCreate}>
                  <Plus className="size-4" /> Create Role
                </Button>
              </Can>
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
