import { useState } from "react"
import { Plus, Sparkles, Trash2 } from "lucide-react"
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
import { useSubscriptionPlan } from "@/hooks/data-fetch"
import type { SubscriptionPlan } from "@/redux/features/subscription-plans"
import { getErrorMessage } from "@/lib/errors"
import { shortId } from "@/lib/format"
import { getCycleLabel } from "@/lib/billing-cycles"
import { SubscriptionPlanFormModal } from "@/components/modal"

const formatMoney = (price: number | null, currency: string | null) => {
  if (price == null) return "—"
  const code = currency || "BDT"
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 2,
    }).format(price)
  } catch {
    return `${code} ${price.toLocaleString()}`
  }
}

export default function PlanListPage() {
  const [search, setSearch] = useState("")
  const debounced = useDebounce(search, 350)

  const {
    plans,
    isFetching,
    isLoading,
    deletePlan,
    togglePlanStatus,
  } = useSubscriptionPlan({ searchTerm: debounced || undefined, limit: 100 })

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<SubscriptionPlan | null>(null)
  const [pendingDelete, setPendingDelete] =
    useState<SubscriptionPlan | null>(null)

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (p: SubscriptionPlan) => {
    setEditing(p)
    setFormOpen(true)
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    try {
      await deletePlan(pendingDelete.id).unwrap()
      toast.success("Plan deleted")
      setPendingDelete(null)
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete plan"))
    }
  }

  const onToggle = async (id: string) => {
    try {
      await togglePlanStatus(id).unwrap()
    } catch {
      toast.error("Failed to update status")
    }
  }

  const columns: Column<SubscriptionPlan>[] = [
    {
      key: "name",
      header: "Plan",
      cell: (p) => (
        <div className="flex items-center gap-3">
          <IconBadge icon={Sparkles} />
          <div className="min-w-0">
            <div className="truncate font-medium">{p.name || "Untitled"}</div>
            <Text size="xs" tone="muted">
              {shortId(p.id)}
            </Text>
          </div>
        </div>
      ),
    },
    {
      key: "cycle",
      header: "Cycle",
      cell: (p) => (
        <span className="text-sm">{getCycleLabel(p.billingCycle)}</span>
      ),
    },
    {
      key: "price",
      header: "Price",
      align: "right",
      cell: (p) => (
        <div className="font-medium tabular-nums">
          {formatMoney(p.price, p.currency)}
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      hideOnMobile: true,
      cell: (p) => (
        <Text size="sm" tone="muted" className="line-clamp-2">
          {p.description || "—"}
        </Text>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (p) => (
        <Switch
          checked={p.isActive}
          onCheckedChange={() => onToggle(p.id)}
          withLabels
        />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      fixed: "right",
      cell: (p) => (
        <div className="flex justify-end gap-1">
          <Can module="subscriptions.plans" action="update">
            <Button
              size="icon-sm"
              variant="soft"
              onClick={() => openEdit(p)}
              aria-label="Edit"
              className="border border-gray-300"
            >
              <FiEdit />
            </Button>
          </Can>
          <Can module="subscriptions.plans" action="delete">
            <Button
              size="icon-sm"
              variant="soft-destructive"
              onClick={() => setPendingDelete(p)}
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
    useState<Column<SubscriptionPlan>[]>(columns)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Plans"
        description="Reusable plan templates — companies pick from these when subscribing."
        actions={
          <Can module="subscriptions.plans" action="create">
            <Button onClick={openCreate}>
              <Plus className="size-4" /> New Plan
            </Button>
          </Can>
        }
      />

      <DataTableToolbar
        value={search}
        onChange={setSearch}
        placeholder="Search plans..."
        fetching={isFetching}
        right={
          <DataTableColumnsButton
            tableName="subscription-plans"
            columns={columns}
            onVisibleColumnsChange={setVisibleColumns}
          />
        }
      />

      <DataTable<SubscriptionPlan>
        data={plans}
        columns={visibleColumns}
        isLoading={isLoading && plans.length === 0}
        isFetching={isFetching}
        empty={
          <EmptyState
            icon={Sparkles}
            title="No plans yet."
            action={
              <Can module="subscriptions.plans" action="create">
                <Button size="sm" onClick={openCreate}>
                  <Plus className="size-4" /> Create Plan
                </Button>
              </Can>
            }
          />
        }
      />

      <SubscriptionPlanFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(v) => !v && setPendingDelete(null)}
        title="Delete plan?"
        description={`This will permanently remove "${pendingDelete?.name ?? ""}".`}
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
