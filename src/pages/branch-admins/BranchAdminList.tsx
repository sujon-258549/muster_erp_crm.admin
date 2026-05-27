import { useMemo, useState } from "react"
import { Plus, ShieldCheck, Trash2 } from "lucide-react"
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
import { useEmployee, useMainBranch } from "@/hooks/data-fetch"
import { useCurrentUser } from "@/hooks/use-permission"
import type { EmployeeRow } from "@/redux/features/users"
import { getErrorMessage } from "@/lib/errors"
import { getCycleLabel } from "@/lib/billing-cycles"
import { BranchAdminFormModal } from "@/components/modal"

const formatMoney = (
  price: string | null | undefined,
  currency: string | null | undefined,
) => {
  if (price == null || price === "") return "—"
  const n = Number(price)
  if (Number.isNaN(n)) return "—"
  const code = currency || "BDT"
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 2,
    }).format(n)
  } catch {
    return `${code} ${n.toLocaleString()}`
  }
}

// Lists every user that owns a branch (= one Company Super Admin per
// customer). Same CRUD shape as Department / Branch lists so behavior is
// predictable across modules.
export default function BranchAdminListPage() {
  const [search, setSearch] = useState("")
  const debounced = useDebounce(search, 350)

  const {
    employees,
    isFetching,
    isLoading,
    deleteEmployee,
    updateEmployee,
  } = useEmployee({ searchTerm: debounced || undefined, limit: 200 })

  // Pull branches so we can (a) look up branch names per row and (b)
  // build the set of users who are actually branch owners.
  const { mainBranches } = useMainBranch({ limit: 200 })
  const branchNameById = useMemo(() => {
    const map = new Map<string, string>()
    mainBranches.forEach((b) => map.set(b.id, b.name ?? "—"))
    return map
  }, [mainBranches])
  // Only users that own a branch belong on this page — that's how we
  // separate them from regular employees who share the same `branchId`.
  const branchOwnerIds = useMemo(() => {
    const set = new Set<string>()
    mainBranches.forEach((b) => {
      if (b.ownerId) set.add(b.ownerId)
    })
    return set
  }, [mainBranches])

  const currentUser = useCurrentUser()
  const currentUserId = currentUser?.id

  const rows = useMemo(
    () =>
      (employees as EmployeeRow[]).filter(
        (e) =>
          branchOwnerIds.has(e.id) &&
          !e.isDeleted &&
          e.id !== currentUserId,
      ),
    [employees, branchOwnerIds, currentUserId],
  )

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<EmployeeRow | null>(null)
  const [pendingDelete, setPendingDelete] = useState<EmployeeRow | null>(null)

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (row: EmployeeRow) => {
    setEditing(row)
    setFormOpen(true)
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    try {
      await deleteEmployee(pendingDelete.id).unwrap()
      toast.success("Branch admin deleted")
      setPendingDelete(null)
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete"))
    }
  }

  const onToggle = async (row: EmployeeRow) => {
    try {
      await updateEmployee({
        id: row.id,
        data: { user: { isActive: !row.isActive } },
      }).unwrap()
    } catch {
      toast.error("Failed to update status")
    }
  }

  const columns: Column<EmployeeRow>[] = [
    {
      key: "name",
      header: "Name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <IconBadge icon={ShieldCheck} />
          <div className="min-w-0">
            <div className="truncate font-medium">{row.name || "—"}</div>
            <Text size="xs" tone="muted">
              {row.email || "—"}
            </Text>
          </div>
        </div>
      ),
    },
    {
      key: "branch",
      header: "Branch",
      cell: (row) => (
        <Text size="sm">
          {row.branchName ??
            (row.branchId ? branchNameById.get(row.branchId) : null) ??
            "—"}
        </Text>
      ),
    },
    {
      key: "role",
      header: "Role",
      hideOnMobile: true,
      cell: (row) => (
        <Text size="sm" tone="muted" className="capitalize">
          {row.roleName ?? row.role ?? "—"}
        </Text>
      ),
    },
    {
      key: "plan",
      header: "Plan",
      hideOnMobile: true,
      cell: (row) =>
        row.planName ? (
          <div className="min-w-0">
            <div className="truncate font-medium">{row.planName}</div>
            <Text size="xs" tone="muted">
              {formatMoney(row.planPrice, row.planCurrency)}
              {" · "}
              {getCycleLabel(row.planBillingCycle)}
            </Text>
          </div>
        ) : (
          <Text size="sm" tone="muted">
            —
          </Text>
        ),
    },
    {
      key: "mobile",
      header: "Phone",
      hideOnMobile: true,
      cell: (row) => (
        <Text size="sm" tone="muted">
          {row.mobile || "—"}
        </Text>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (row) => (
        <Switch
          checked={!!row.isActive}
          onCheckedChange={() => onToggle(row)}
          withLabels
        />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      fixed: "right",
      cell: (row) => (
        <div className="flex justify-end gap-1">
          <Can module="branchAdmins" action="update">
            <Button
              size="icon-sm"
              variant="soft"
              onClick={() => openEdit(row)}
              aria-label="Edit"
              className="border border-gray-300"
            >
              <FiEdit />
            </Button>
          </Can>
          <Can module="branchAdmins" action="delete">
            <Button
              size="icon-sm"
              variant="soft-destructive"
              onClick={() => setPendingDelete(row)}
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

  const [visibleColumns, setVisibleColumns] =
    useState<Column<EmployeeRow>[]>(columns)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Branch Super Admins"
        description="One owner account per customer company. Hand over after creating their branch + subscription."
        actions={
          <Can module="branchAdmins" action="create">
            <Button onClick={openCreate}>
              <Plus className="size-4" /> New Branch Admin
            </Button>
          </Can>
        }
      />

      <DataTableToolbar
        value={search}
        onChange={setSearch}
        placeholder="Search by name, email..."
        fetching={isFetching}
        right={
          <DataTableColumnsButton
            tableName="branch-admins"
            columns={columns}
            onVisibleColumnsChange={setVisibleColumns}
          />
        }
      />

      <DataTable<EmployeeRow>
        data={rows}
        columns={visibleColumns}
        isLoading={isLoading && rows.length === 0}
        isFetching={isFetching}
        empty={
          <EmptyState
            icon={ShieldCheck}
            title="No branch admins yet."
            action={
              <Can module="branchAdmins" action="create">
                <Button size="sm" onClick={openCreate}>
                  <Plus className="size-4" /> Create Branch Admin
                </Button>
              </Can>
            }
          />
        }
      />

      <BranchAdminFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(v) => !v && setPendingDelete(null)}
        title="Delete branch admin?"
        description={`This will permanently remove "${pendingDelete?.name ?? ""}".`}
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
