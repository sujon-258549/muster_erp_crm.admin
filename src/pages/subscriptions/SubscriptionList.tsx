import { useMemo, useState } from "react"
import { Plus, Receipt, Trash2 } from "lucide-react"
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
  FormatDate,
  IconBadge,
  PageHeader,
  StatusBadge,
  Text,
  type Column,
} from "@/components/shared"
import { useDebounce } from "@/hooks/use-debounce"
import { useMainBranch, useSubscription } from "@/hooks/data-fetch"
import type { Subscription } from "@/redux/features/subscriptions"
import { getErrorMessage } from "@/lib/errors"
import { shortId } from "@/lib/format"
import { getCycleLabel } from "@/lib/billing-cycles"
import { SubscriptionFormModal } from "@/components/modal"

const formatMoney = (
  price: number | string | null | undefined,
  currency: string | null | undefined,
) => {
  if (price == null || price === "") return "—"
  const n = typeof price === "string" ? Number(price) : price
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

// Pick the right tone + label for a subscription period: trial / active /
// expiring soon / expired — based on today vs end date.
const periodTone = (s: Subscription): {
  tone: "success" | "warning" | "blocked" | "info" | "inactive"
  label: string
} => {
  if (!s.endDate) return { tone: "info", label: "No expiry" }
  const end = new Date(s.endDate)
  const now = new Date()
  const msInDay = 24 * 60 * 60 * 1000
  const daysLeft = Math.ceil((end.getTime() - now.getTime()) / msInDay)
  if (daysLeft < 0) return { tone: "blocked", label: "Expired" }
  if (daysLeft <= 7) return { tone: "warning", label: `${daysLeft}d left` }
  // Use sky blue (info) instead of green here so it doesn't visually
  // merge with the Active toggle on the same row.
  return { tone: "info", label: `${daysLeft}d left` }
}

export default function SubscriptionListPage() {
  const [search, setSearch] = useState("")
  const debounced = useDebounce(search, 350)

  const {
    subscriptions,
    isFetching,
    isLoading,
    deleteSubscription,
    toggleSubscriptionStatus,
  } = useSubscription({ searchTerm: debounced || undefined, limit: 100 })

  // Branch lookup for displaying company names on rows where the API
  // doesn't already include branchName.
  const { mainBranches } = useMainBranch({ limit: 200 })
  const branchNameById = useMemo(() => {
    const map = new Map<string, string>()
    mainBranches.forEach((b) => map.set(b.id, b.name ?? "—"))
    return map
  }, [mainBranches])

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Subscription | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Subscription | null>(null)

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (s: Subscription) => {
    setEditing(s)
    setFormOpen(true)
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    try {
      await deleteSubscription(pendingDelete.id).unwrap()
      toast.success("Subscription deleted")
      setPendingDelete(null)
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete subscription"))
    }
  }

  const onToggle = async (id: string) => {
    try {
      await toggleSubscriptionStatus(id).unwrap()
    } catch {
      toast.error("Failed to update status")
    }
  }

  const columns: Column<Subscription>[] = [
    {
      key: "company",
      header: "Company",
      cell: (s) => {
        const name =
          s.branch?.name ??
          s.branchName ??
          (s.branchId ? branchNameById.get(s.branchId) : null)
        return (
          <div className="flex items-center gap-3">
            <IconBadge icon={Receipt} />
            <div className="min-w-0">
              <div className="truncate font-medium">{name || "—"}</div>
              <Text size="xs" tone="muted">
                {shortId(s.id)}
              </Text>
            </div>
          </div>
        )
      },
    },
    {
      key: "plan",
      header: "Plan",
      cell: (s) => (
        <div className="min-w-0">
          <div className="truncate font-medium">{s.plan?.name || "—"}</div>
          <Text size="xs" tone="muted">
            {getCycleLabel(s.plan?.billingCycle)}
          </Text>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      hideOnMobile: true,
      cell: (s) => (
        <div className="font-medium tabular-nums">
          {formatMoney(s.plan?.price, s.plan?.currency)}
        </div>
      ),
    },
    {
      key: "period",
      header: "Period",
      hideOnMobile: true,
      cell: (s) => {
        const tone = periodTone(s)
        return (
          <div className="space-y-1">
            <Text size="sm">
              <FormatDate value={s.startDate} format="short" />
              {" → "}
              <FormatDate value={s.endDate} format="short" />
            </Text>
            <StatusBadge tone={tone.tone} label={tone.label} />
          </div>
        )
      },
    },
    {
      key: "status",
      header: "Status",
      cell: (s) => (
        <Switch
          checked={s.isActive}
          onCheckedChange={() => onToggle(s.id)}
          withLabels
        />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      fixed: "right",
      cell: (s) => (
        <div className="flex justify-end gap-1">
          <Can module="subscriptions.list" action="update">
            <Button
              size="icon-sm"
              variant="soft"
              onClick={() => openEdit(s)}
              aria-label="Edit"
              className="border border-gray-300"
            >
              <FiEdit />
            </Button>
          </Can>
          <Can module="subscriptions.list" action="delete">
            <Button
              size="icon-sm"
              variant="soft-destructive"
              onClick={() => setPendingDelete(s)}
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
    useState<Column<Subscription>[]>(columns)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscriptions"
        description="Manage recurring plans sold to customer companies — period, price, and status."
        actions={
          <Can module="subscriptions.list" action="create">
            <Button onClick={openCreate}>
              <Plus className="size-4" /> New Subscription
            </Button>
          </Can>
        }
      />

      <DataTableToolbar
        value={search}
        onChange={setSearch}
        placeholder="Search by company or plan..."
        fetching={isFetching}
        right={
          <DataTableColumnsButton
            tableName="subscriptions"
            columns={columns}
            onVisibleColumnsChange={setVisibleColumns}
          />
        }
      />

      <DataTable<Subscription>
        data={subscriptions}
        columns={visibleColumns}
        isLoading={isLoading && subscriptions.length === 0}
        isFetching={isFetching}
        empty={
          <EmptyState
            icon={Receipt}
            title="No subscriptions yet."
            action={
              <Can module="subscriptions.list" action="create">
                <Button size="sm" onClick={openCreate}>
                  <Plus className="size-4" /> Create Subscription
                </Button>
              </Can>
            }
          />
        }
      />

      <SubscriptionFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
      />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(v) => !v && setPendingDelete(null)}
        title="Delete subscription?"
        description={`This will permanently remove the "${
          pendingDelete?.plan?.name ?? ""
        }" subscription.`}
        confirmLabel="Delete"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  )
}
