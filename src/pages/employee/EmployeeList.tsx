import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Ban, Plus, Trash2, UserMinus, Users as UsersIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  ConfirmDialog,
  DataTable,
  DataTableColumnsButton,
  DataTablePagination,
  DataTableToolbar,
  EmptyState,
  PageHeader,
  StatusBadge,
  SummaryCard,
  Text,
  UserAvatar,
  pickEmployeeTone,
  type Column,
} from "@/components/shared"
import { useDebounce } from "@/hooks/use-debounce"
import { useEmployee } from "@/hooks/data-fetch"
import { useCurrentUser } from "@/hooks/use-permission"
import { ROUTES } from "@/config/paths"
import { shortId } from "@/lib/format"
import { getErrorMessage } from "@/lib/errors"
import type { EmployeeRow } from "@/redux/features/users"

const PAGE_SIZE = 10

export default function EmployeeListPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const debounced = useDebounce(search, 350)
  const currentUser = useCurrentUser()
  const currentUserId = currentUser?.id

  const {
    employees,
    meta,
    error,
    isFetching,
    isLoading,
    blockEmployee,
    softDeleteEmployee,
    deleteEmployee,
  } = useEmployee({
    searchTerm: debounced || undefined,
    page,
    limit: PAGE_SIZE,
  })

  const [pendingDelete, setPendingDelete] = useState<EmployeeRow | null>(null)
  const [pendingSoftDelete, setPendingSoftDelete] = useState<EmployeeRow | null>(
    null,
  )

  const totalPages = meta?.totalPages ?? 1
  const total = meta?.total ?? 0

  const summary = useMemo(() => {
    const active = employees.filter((e) => e.isActive && !e.isBlocked).length
    const blocked = employees.filter((e) => e.isBlocked).length
    return { active, blocked, total: employees.length }
  }, [employees])

  const onBlock = async (id: string) => {
    if (id === currentUserId) {
      toast.error("You can't block your own account")
      return
    }
    try {
      await blockEmployee(id).unwrap()
      toast.success("Block status updated")
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update block status"))
    }
  }

  const confirmSoftDelete = async () => {
    if (!pendingSoftDelete) return
    if (pendingSoftDelete.id === currentUserId) {
      toast.error("You can't delete your own account")
      setPendingSoftDelete(null)
      return
    }
    try {
      await softDeleteEmployee(pendingSoftDelete.id).unwrap()
      toast.success("Employee soft-deleted")
      setPendingSoftDelete(null)
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to soft-delete employee"))
    }
  }

  const confirmHardDelete = async () => {
    if (!pendingDelete) return
    if (pendingDelete.id === currentUserId) {
      toast.error("You can't delete your own account")
      setPendingDelete(null)
      return
    }
    try {
      await deleteEmployee(pendingDelete.id).unwrap()
      toast.success("Employee deleted")
      setPendingDelete(null)
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete employee"))
    }
  }

  const columns: Column<EmployeeRow>[] = [
    {
      key: "name",
      header: "Name",
      cell: (u) => (
        <div className="flex items-center gap-3">
          <UserAvatar name={u.name} src={u.avatar} />
          <div>
            <div className="font-medium">{u.name || "—"}</div>
            <Text size="xs" tone="muted">
              {shortId(u.id)}
            </Text>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      hideOnMobile: true,
      cell: (u) => (
        <div className="flex flex-col">
          <Text size="sm" tone="muted">
            {u.email || "—"}
          </Text>
          <Text size="xs" tone="muted">
            {u.mobile || ""}
          </Text>
        </div>
      ),
    },
    {
      key: "designation",
      header: "Designation",
      hideOnMobile: true,
      cell: (u) => (
        <Text size="sm" tone="muted">
          {u.designationName || "—"}
        </Text>
      ),
    },
    {
      key: "department",
      header: "Department",
      hideOnMobile: true,
      cell: (u) => (
        <Text size="sm" tone="muted">
          {u.departmentName || "—"}
        </Text>
      ),
    },
    {
      key: "role",
      header: "Role",
      cell: (u) => (
        <StatusBadge
          tone="info"
          label={(u.role ?? "—").replace("-", " ")}
          className="capitalize"
        />
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (u) =>
        u.isBlocked ? (
          <StatusBadge tone="blocked" />
        ) : u.isDeleted ? (
          <StatusBadge tone="deleted" />
        ) : (
          <StatusBadge tone={pickEmployeeTone(u)} />
        ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      cell: (u) => {
        const isSelf = u.id === currentUserId
        const selfTitle = "You can't perform this action on your own account"
        return (
          <div className="flex justify-end gap-1">
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => onBlock(u.id)}
              disabled={isSelf}
              aria-label="Toggle block"
              title={isSelf ? selfTitle : "Toggle block"}
            >
              <Ban />
            </Button>
            <Button
              size="icon-sm"
              variant="soft-warning"
              onClick={() => setPendingSoftDelete(u)}
              disabled={isSelf}
              aria-label="Soft delete"
              title={isSelf ? selfTitle : "Soft delete"}
            >
              <UserMinus />
            </Button>
            <Button
              size="icon-sm"
              variant="soft-destructive"
              onClick={() => setPendingDelete(u)}
              disabled={isSelf}
              aria-label="Delete"
              title={isSelf ? selfTitle : "Delete"}
            >
              <Trash2 />
            </Button>
          </div>
        )
      },
    },
  ]

  // The "Columns" dropdown in the toolbar owns its hidden-set internally;
  // we just track which columns it tells us are visible and forward them
  // to the table.
  const [visibleColumns, setVisibleColumns] =
    useState<Column<EmployeeRow>[]>(columns)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee List"
        description="Manage your workforce, their roles, departments and designations."
        actions={
          <Button asChild>
            <Link to={ROUTES.EMPLOYEES.CREATE}>
              <Plus className="size-4" />
              Create Employee
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Employees"
          value={total}
          trend="03% This Week"
          tone="violet"
        />
        <SummaryCard
          title="On This Page"
          value={summary.total}
          trend="Up to date"
          tone="sky"
        />
        <SummaryCard
          title="Active"
          value={summary.active}
          trend="03% This Week"
          tone="teal"
        />
        <SummaryCard
          title="Blocked"
          value={summary.blocked}
          trend="03% This Week"
          tone="rose"
        />
      </div>

      <DataTableToolbar
        value={search}
        onChange={(v) => {
          setPage(1)
          setSearch(v)
        }}
        placeholder="Search by name, email or mobile..."
        fetching={isFetching}
        right={
          <DataTableColumnsButton
            tableName="employees"
            columns={columns}
            onVisibleColumnsChange={setVisibleColumns}
          />
        }
      />

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          Failed to load employees. Check that the backend is running on{" "}
          <code className="mx-1">{import.meta.env.VITE_API_URL ?? "/api"}</code>{" "}
          and you are signed in.
        </div>
      )}

      <DataTable<EmployeeRow>
        data={employees}
        columns={visibleColumns}
        isLoading={isLoading && employees.length === 0}
        isFetching={isFetching}
        empty={
          <EmptyState
            icon={UsersIcon}
            title="No employees found."
            description="Add your first employee to get started."
            action={
              <Button asChild size="sm">
                <Link to={ROUTES.EMPLOYEES.CREATE}>
                  <Plus className="size-4" /> Create Employee
                </Link>
              </Button>
            }
          />
        }
        footer={
          employees.length > 0 ? (
            <DataTablePagination
              page={page}
              totalPages={totalPages}
              total={total}
              pageSize={PAGE_SIZE}
              showing={employees.length}
              onPageChange={setPage}
            />
          ) : null
        }
      />

      <ConfirmDialog
        open={Boolean(pendingSoftDelete)}
        onOpenChange={(v) => !v && setPendingSoftDelete(null)}
        title="Soft-delete employee?"
        description={`This will move "${pendingSoftDelete?.name ?? ""}" to a deleted state. They can be restored later.`}
        confirmLabel="Soft delete"
        onConfirm={confirmSoftDelete}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(v) => !v && setPendingDelete(null)}
        title="Permanently delete employee?"
        description={`This will permanently remove "${pendingDelete?.name ?? ""}" and all related records.`}
        confirmLabel="Delete permanently"
        destructive
        onConfirm={confirmHardDelete}
      />
    </div>
  )
}

