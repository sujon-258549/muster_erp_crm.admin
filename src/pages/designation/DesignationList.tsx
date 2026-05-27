import { useState } from "react"
import { BadgeCheck, Plus, Trash2 } from "lucide-react"
import { FiEdit } from "react-icons/fi"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Can,
  ConfirmDialog,
  DataTable,
  DataTableColumnsButton,
  DataTablePagination,
  DataTableToolbar,
  EmptyState,
  FormatDate,
  IconBadge,
  PageHeader,
  Text,
  type Column,
} from "@/components/shared"
import { useDebounce } from "@/hooks/use-debounce"
import { useDesignation } from "@/hooks/data-fetch"
import type { Designation } from "@/redux/features/designations"
import { getErrorMessage } from "@/lib/errors"
import { shortId } from "@/lib/format"
import { DesignationFormModal } from "@/components/modal"

// Page-size kept on the page itself so the API call signature stays
// declarative: useDesignation({ page, limit, searchTerm }).
const PAGE_SIZE = 10

export default function DesignationListPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  // Debounced search keeps the API quiet while the user is typing — the
  // actual filtering then happens server-side via the `searchTerm` query.
  const debounced = useDebounce(search, 350)

  const {
    designations,
    meta,
    isFetching,
    isLoading,
    deleteDesignation,
    toggleDesignationStatus,
  } = useDesignation({
    searchTerm: debounced || undefined,
    page,
    limit: PAGE_SIZE,
  })

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Designation | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Designation | null>(null)

  const totalPages = meta?.totalPages ?? 1
  const total = meta?.total ?? 0

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

  // Column definitions — `hideOnMobile` keeps the table readable on phones
  // by collapsing secondary columns below md.
  const columns: Column<Designation>[] = [
    {
      key: "name",
      header: "Name",
      cell: (d) => (
        <div className="flex items-center gap-3">
          <IconBadge icon={BadgeCheck} />
          <div className="min-w-0">
            <div className="truncate font-medium">{d.name}</div>
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
      key: "createdAt",
      header: "Created",
      hideOnMobile: true,
      cell: (d) => (
        <Text size="sm" tone="muted">
          <FormatDate value={d.createdAt} format="short" />
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
          <Can module="designations" action="update">
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
          <Can module="designations" action="delete">
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

  // Toolbar's "Columns" dropdown owns its own visibility state and reports
  // the filtered column list back here.
  const [visibleColumns, setVisibleColumns] =
    useState<Column<Designation>[]>(columns)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Designation List"
        description="Job titles assigned to employees — e.g. Software Engineer, HR Manager."
        actions={
          <Can module="designations" action="create">
            <Button onClick={openCreate}>
              <Plus className="size-4" /> New Designation
            </Button>
          </Can>
        }
      />

      <DataTableToolbar
        value={search}
        onChange={(v) => {
          // Reset to page 1 on every new search term so users don't see a
          // stale page that no longer matches the query.
          setPage(1)
          setSearch(v)
        }}
        placeholder="Search designations..."
        fetching={isFetching}
        right={
          <DataTableColumnsButton
            tableName="designations"
            columns={columns}
            onVisibleColumnsChange={setVisibleColumns}
          />
        }
      />

      <DataTable<Designation>
        data={designations}
        columns={visibleColumns}
        isLoading={isLoading && designations.length === 0}
        isFetching={isFetching}
        empty={
          <EmptyState
            icon={BadgeCheck}
            title="No designations yet."
            action={
              <Can module="designations" action="create">
                <Button size="sm" onClick={openCreate}>
                  <Plus className="size-4" /> Create Designation
                </Button>
              </Can>
            }
          />
        }
        footer={
          designations.length > 0 ? (
            <DataTablePagination
              page={page}
              totalPages={totalPages}
              total={total}
              pageSize={PAGE_SIZE}
              showing={designations.length}
              onPageChange={setPage}
            />
          ) : null
        }
      />

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
