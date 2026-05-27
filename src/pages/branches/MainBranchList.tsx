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
import { useMainBranch } from "@/hooks/data-fetch"
import type { MainBranch } from "@/redux/features/main-branches"
import { getErrorMessage } from "@/lib/errors"
import { shortId } from "@/lib/format"
import { MainBranchFormModal } from "@/components/modal"

export default function BranchListPage() {
  const [search, setSearch] = useState("")
  const debounced = useDebounce(search, 350)

  const {
    mainBranches,
    isFetching,
    isLoading,
    deleteMainBranch,
    toggleMainBranchStatus,
  } = useMainBranch({ searchTerm: debounced || undefined, limit: 100 })

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<MainBranch | null>(null)
  const [pendingDelete, setPendingDelete] = useState<MainBranch | null>(null)

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (b: MainBranch) => {
    setEditing(b)
    setFormOpen(true)
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    try {
      await deleteMainBranch(pendingDelete.id).unwrap()
      toast.success("Main Branch deleted")
      setPendingDelete(null)
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete main branch"))
    }
  }

  const onToggle = async (id: string) => {
    try {
      await toggleMainBranchStatus(id).unwrap()
    } catch {
      toast.error("Failed to update status")
    }
  }

  const columns: Column<MainBranch>[] = [
    {
      key: "name",
      header: "Main Branch",
      className: "whitespace-nowrap",
      cell: (b) => (
        <div className="flex items-center gap-3">
          <IconBadge icon={Building2} />
          <div className="min-w-0">
            <div className="truncate font-medium">{b.name || "Untitled"}</div>
            <Text size="xs" tone="muted">
              {shortId(b.id)}
            </Text>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      hideOnMobile: true,
      className: "whitespace-nowrap",
      cell: (b) => (
        <div className="flex flex-col">
          <Text size="sm" tone="muted">
            {b.email || "—"}
          </Text>
          <Text size="xs" tone="muted">
            {b.phone ?? ""}
          </Text>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      hideOnMobile: true,
      className: "whitespace-nowrap",
      cell: (b) => (
        <Text size="sm" tone="muted">
          {[b.division, b.district].filter(Boolean).join(", ") || "—"}
        </Text>
      ),
    },
    {
      key: "industry",
      header: "Industry",
      hideOnMobile: true,
      cell: (b) => (
        <Text size="sm" tone="muted">
          {b.industry || "—"}
        </Text>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (b) => (
        <Switch
          checked={b.isActive}
          onCheckedChange={() => onToggle(b.id)}
          withLabels
        />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      fixed: "right",
      cell: (b) => (
        <div className="flex justify-end gap-1">
          <Can module="branches.list" action="update">
            <Button
              size="icon-sm"
              variant="soft"
              onClick={() => openEdit(b)}
              aria-label="Edit"
              className="border border-gray-300"
            >
              <FiEdit />
            </Button>
          </Can>
          <Can module="branches.list" action="delete">
            <Button
              size="icon-sm"
              variant="soft-destructive"
              onClick={() => setPendingDelete(b)}
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
    useState<Column<MainBranch>[]>(columns)

  return (
    <div className="space-y-5">
      <PageHeader
        title="Main Branches"
        description="Top-level locations — head office, regional offices, outlets."
        actions={
          <Can module="branches.list" action="create">
            <Button onClick={openCreate}>
              <Plus className="size-4" /> New Main Branch
            </Button>
          </Can>
        }
      />

      <DataTableToolbar
        value={search}
        onChange={setSearch}
        placeholder="Search main branches..."
        fetching={isFetching}
        right={
          <DataTableColumnsButton
            tableName="branches"
            columns={columns}
            onVisibleColumnsChange={setVisibleColumns}
          />
        }
      />

      <DataTable<MainBranch>
        data={mainBranches}
        columns={visibleColumns}
        isLoading={isLoading && mainBranches.length === 0}
        isFetching={isFetching}
        empty={
          <EmptyState
            icon={Building2}
            title="No main branches yet."
            action={
              <Can module="branches.list" action="create">
                <Button size="sm" onClick={openCreate}>
                  <Plus className="size-4" /> Create Main Branch
                </Button>
              </Can>
            }
          />
        }
      />

      <MainBranchFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(v) => !v && setPendingDelete(null)}
        title="Delete main branch?"
        description={`This will permanently remove "${pendingDelete?.name ?? ""}" and any sub-branches under it.`}
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
