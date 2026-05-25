import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Ban, Plus, Trash2, UserMinus, Users as UsersIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ConfirmDialog,
  DataTable,
  DataTablePagination,
  DataTableToolbar,
  EmptyState,
  PageHeader,
  StatusBadge,
  Text,
  UserAvatar,
  pickEmployeeTone,
  type Column,
} from "@/components/shared"
import { useDebounce } from "@/hooks/use-debounce"
import { useEmployee } from "@/hooks/data-fetch"
import { ROUTES } from "@/config/paths"
import { shortId } from "@/lib/format"
import { getErrorMessage } from "@/lib/errors"
import type { EmployeeRow } from "@/redux/features/users"

const PAGE_SIZE = 10

export default function EmployeeListPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const debounced = useDebounce(search, 350)

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
    try {
      await blockEmployee(id).unwrap()
      toast.success("Block status updated")
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update block status"))
    }
  }

  const confirmSoftDelete = async () => {
    if (!pendingSoftDelete) return
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
      cell: (u) => (
        <Text size="sm" tone="muted">
          {u.designationName || "—"}
        </Text>
      ),
    },
    {
      key: "department",
      header: "Department",
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
      cell: (u) => (
        <div className="flex justify-end gap-1">
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => onBlock(u.id)}
            aria-label="Toggle block"
            title="Toggle block"
          >
            <Ban />
          </Button>
          <Button
            size="icon-sm"
            variant="soft-warning"
            onClick={() => setPendingSoftDelete(u)}
            aria-label="Soft delete"
            title="Soft delete"
          >
            <UserMinus />
          </Button>
          <Button
            size="icon-sm"
            variant="soft-destructive"
            onClick={() => setPendingDelete(u)}
            aria-label="Delete"
            title="Delete"
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
        title="Employee List"
        description="Manage your workforce, their roles, departments and designations."
        actions={
          <Button asChild>
            <Link to={ROUTES.EMPLOYEES.CREATE}>
              <Plus className="mr-2 size-4" />
              Create Employee
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Total on page" value={summary.total} />
        <SummaryCard label="Active" value={summary.active} tone="success" />
        <SummaryCard label="Blocked" value={summary.blocked} tone="warn" />
      </div>

      <DataTableToolbar
        value={search}
        onChange={(v) => {
          setPage(1)
          setSearch(v)
        }}
        placeholder="Search by name, email or mobile..."
        fetching={isFetching}
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
        columns={columns}
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
                  <Plus className="mr-1.5 size-4" /> Create Employee
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

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone?: "success" | "warn"
}) {
  const ring =
    tone === "success"
      ? "ring-emerald-500/40 bg-emerald-500/5"
      : tone === "warn"
        ? "ring-amber-500/40 bg-amber-500/5"
        : "ring-border bg-card"
  return (
    <Card className={`ring-1 ${ring}`}>
      <CardContent className="p-4">
        <Text size="xs" tone="muted" className="uppercase tracking-wide">
          {label}
        </Text>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  )
}
