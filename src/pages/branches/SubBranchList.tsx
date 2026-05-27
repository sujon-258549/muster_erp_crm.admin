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
import { useSubBranch } from "@/hooks/data-fetch"
import type { SubBranch } from "@/redux/features/subBranches"
import { getErrorMessage } from "@/lib/errors"
import { shortId } from "@/lib/format"
import { SubBranchFormModal } from "@/components/modal"

export default function SubBranchListPage() {
  const [search, setSearch] = useState("")
  const debounced = useDebounce(search, 350)

  const {
    subBranches,
    isFetching,
    isLoading,
    deleteSubBranch,
    toggleSubBranchStatus,
  } = useSubBranch({ searchTerm: debounced || undefined, limit: 100 })

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<SubBranch | null>(null)
  const [pendingDelete, setPendingDelete] = useState<SubBranch | null>(null)

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (sb: SubBranch) => {
    setEditing(sb)
    setFormOpen(true)
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    try {
      await deleteSubBranch(pendingDelete.id).unwrap()
      toast.success("Sub branch deleted")
      setPendingDelete(null)
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete sub branch"))
    }
  }

  const onToggle = async (id: string) => {
    try {
      await toggleSubBranchStatus(id).unwrap()
    } catch {
      toast.error("Failed to update status")
    }
  }

  const columns: Column<SubBranch>[] = [
    {
      key: "name",
      header: "Sub Branch",
      className: "whitespace-nowrap",
      cell: (sb) => (
        <div className="flex items-center gap-3">
          <IconBadge icon={Building2} />
          <div className="min-w-0">
            <div className="truncate font-medium">{sb.name || "Untitled"}</div>
            <Text size="xs" tone="muted">
              {shortId(sb.id)}
            </Text>
          </div>
        </div>
      ),
    },
    {
      key: "branch",
      header: "Parent Branch",
      hideOnMobile: true,
      className: "whitespace-nowrap",
      cell: (sb) => (
        <Text size="sm" tone="muted">
          {sb.branch?.name ?? "—"}
        </Text>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      hideOnMobile: true,
      className: "whitespace-nowrap",
      cell: (sb) => (
        <div className="flex flex-col">
          <Text size="sm" tone="muted">
            {sb.email || "—"}
          </Text>
          <Text size="xs" tone="muted">
            {sb.phone ?? ""}
          </Text>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      hideOnMobile: true,
      className: "whitespace-nowrap",
      cell: (sb) => (
        <Text size="sm" tone="muted">
          {[sb.division, sb.district].filter(Boolean).join(", ") || "—"}
        </Text>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (sb) => (
        <Switch
          checked={sb.isActive}
          onCheckedChange={() => onToggle(sb.id)}
          withLabels
        />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      fixed: "right",
      cell: (sb) => (
        <div className="flex justify-end gap-1">
          <Can module="subbranches.list" action="update">
            <Button
              size="icon-sm"
              variant="soft"
              onClick={() => openEdit(sb)}
              aria-label="Edit"
              className="border border-gray-300"
            >
              <FiEdit />
            </Button>
          </Can>
          <Can module="subbranches.list" action="delete">
            <Button
              size="icon-sm"
              variant="soft-destructive"
              onClick={() => setPendingDelete(sb)}
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
    useState<Column<SubBranch>[]>(columns)

  return (
    <div className="space-y-5">
      <PageHeader
        title="Sub Branches"
        description="Sub-units rolled up into a parent branch — departments, sub-offices, kiosks."
        actions={
          <Can module="subbranches.list" action="create">
            <Button onClick={openCreate}>
              <Plus className="size-4" /> New Sub Branch
            </Button>
          </Can>
        }
      />

      <DataTableToolbar
        value={search}
        onChange={setSearch}
        placeholder="Search sub branches..."
        fetching={isFetching}
        right={
          <DataTableColumnsButton
            tableName="sub-branches"
            columns={columns}
            onVisibleColumnsChange={setVisibleColumns}
          />
        }
      />

      <DataTable<SubBranch>
        data={subBranches}
        columns={visibleColumns}
        isLoading={isLoading && subBranches.length === 0}
        isFetching={isFetching}
        empty={
          <EmptyState
            icon={Building2}
            title="No sub branches yet."
            action={
              <Can module="subbranches.list" action="create">
                <Button size="sm" onClick={openCreate}>
                  <Plus className="size-4" /> Create Sub Branch
                </Button>
              </Can>
            }
          />
        }
      />

      <SubBranchFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(v) => !v && setPendingDelete(null)}
        title="Delete sub branch?"
        description={`This will permanently remove "${pendingDelete?.name ?? ""}".`}
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
