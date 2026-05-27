import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select } from "@/components/ui/select"
import { Combobox } from "@/components/ui/combobox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormField } from "@/components/shared"
import {
  useBranch,
  useSubscription,
  useSubscriptionPlan,
} from "@/hooks/data-fetch"
import type {
  BillingCycle,
  Subscription,
} from "@/redux/features/subscriptions"
import type { SubscriptionPlan } from "@/redux/features/subscription-plans"
import { getErrorMessage } from "@/lib/errors"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: Subscription | null
  onCreated?: (sub: Subscription) => void
}

export function SubscriptionFormModal({
  open,
  onOpenChange,
  initial,
  onCreated,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <SubscriptionForm
          key={initial?.id ?? "new"}
          initial={initial ?? null}
          onClose={() => onOpenChange(false)}
          onCreated={onCreated}
        />
      </DialogContent>
    </Dialog>
  )
}

interface FormState {
  branchId: string
  planId: string
  planName: string
  price: string
  currency: string
  billingCycle: BillingCycle
  startDate: string
  endDate: string
  notes: string
  isActive: boolean
}

const todayIso = () => new Date().toISOString().slice(0, 10)

// Default end date one cycle out from the chosen start.
const addCycle = (startIso: string, cycle: BillingCycle): string => {
  if (cycle === "lifetime") return ""
  const d = new Date(startIso)
  if (Number.isNaN(d.getTime())) return ""
  if (cycle === "monthly") d.setMonth(d.getMonth() + 1)
  else if (cycle === "quarterly") d.setMonth(d.getMonth() + 3)
  else if (cycle === "half-yearly") d.setMonth(d.getMonth() + 6)
  else d.setFullYear(d.getFullYear() + 1)
  return d.toISOString().slice(0, 10)
}

function makeInitial(initial: Subscription | null): FormState {
  if (!initial) {
    const start = todayIso()
    return {
      branchId: "",
      planId: "",
      planName: "",
      price: "",
      currency: "BDT",
      billingCycle: "monthly",
      startDate: start,
      endDate: addCycle(start, "monthly"),
      notes: "",
      isActive: true,
    }
  }
  return {
    branchId: initial.branchId ?? "",
    planId: initial.planId ?? "",
    planName: initial.planName ?? "",
    price: initial.price != null ? String(initial.price) : "",
    currency: initial.currency ?? "BDT",
    billingCycle: initial.billingCycle ?? "monthly",
    startDate: initial.startDate?.slice(0, 10) ?? todayIso(),
    endDate: initial.endDate?.slice(0, 10) ?? "",
    notes: initial.notes ?? "",
    isActive: initial.isActive,
  }
}

const CURRENCIES = ["BDT", "USD", "EUR", "INR"] as const
const CYCLES: { value: BillingCycle; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly (3 months)" },
  { value: "half-yearly", label: "Half-yearly (6 months)" },
  { value: "yearly", label: "Yearly" },
  { value: "lifetime", label: "Lifetime (no expiry)" },
]

function SubscriptionForm({
  initial,
  onClose,
  onCreated,
}: {
  initial: Subscription | null
  onClose: () => void
  onCreated?: (sub: Subscription) => void
}) {
  const [form, setForm] = useState<FormState>(() => makeInitial(initial))
  const { branches } = useBranch({ limit: 200 })
  const { plans } = useSubscriptionPlan({ limit: 200 })
  const { createSubscription, updateSubscription, isLoading } = useSubscription()
  const isEdit = Boolean(initial?.id)

  // When start date or cycle changes on a fresh form, recompute the end
  // date so the user gets a sensible default. We only auto-update when
  // the user hasn't manually edited endDate in the current session.
  const [endDateTouched, setEndDateTouched] = useState(false)

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  // Picking a plan auto-fills name + cycle + price + currency. The user
  // can still tweak any of them afterwards (e.g. one-off discount).
  const applyPlan = (planId: string) => {
    const plan: SubscriptionPlan | undefined = plans.find((p) => p.id === planId)
    if (!plan) {
      update("planId", "")
      return
    }
    const cycle: BillingCycle = plan.billingCycle ?? "monthly"
    setForm((prev) => ({
      ...prev,
      planId: plan.id,
      planName: plan.name ?? "",
      price: plan.price != null ? String(plan.price) : prev.price,
      currency: plan.currency ?? prev.currency,
      billingCycle: cycle,
      endDate: endDateTouched ? prev.endDate : addCycle(prev.startDate, cycle),
    }))
  }
  const handleStart = (v: string) => {
    setForm((prev) => ({
      ...prev,
      startDate: v,
      endDate: endDateTouched ? prev.endDate : addCycle(v, prev.billingCycle),
    }))
  }
  const handleCycle = (v: BillingCycle) => {
    setForm((prev) => ({
      ...prev,
      billingCycle: v,
      endDate: endDateTouched ? prev.endDate : addCycle(prev.startDate, v),
    }))
  }

  const isLifetime = form.billingCycle === "lifetime"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.branchId) return toast.error("Select a company / branch")
    if (!form.planName.trim()) return toast.error("Plan name is required")
    const priceNum = Number(form.price)
    if (!form.price || Number.isNaN(priceNum) || priceNum < 0)
      return toast.error("Enter a valid price")
    if (!form.startDate) return toast.error("Start date is required")
    if (!isLifetime) {
      if (!form.endDate) return toast.error("End date is required")
      if (form.endDate < form.startDate)
        return toast.error("End date must be after start date")
    }

    const payload = {
      branchId: form.branchId,
      planId: form.planId || undefined,
      planName: form.planName.trim(),
      price: priceNum,
      currency: form.currency,
      billingCycle: form.billingCycle,
      startDate: form.startDate,
      endDate: isLifetime ? null : form.endDate,
      notes: form.notes.trim() || undefined,
      isActive: form.isActive,
    }

    try {
      if (isEdit && initial) {
        await updateSubscription({ id: initial.id, data: payload }).unwrap()
        toast.success("Subscription updated")
      } else {
        const res = await createSubscription(payload).unwrap()
        toast.success("Subscription created")
        if (res?.data) onCreated?.(res.data)
      }
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save subscription"))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {isEdit ? "Edit Subscription" : "Create Subscription"}
        </DialogTitle>
        <DialogDescription>
          Tie a plan + billing period to a company. After the end date, access lapses.
        </DialogDescription>
      </DialogHeader>

      <div className="my-3 grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FormField label="Company / Branch" required>
            <Combobox
              value={form.branchId}
              onChange={(v) => update("branchId", v)}
              disabled={isEdit}
              placeholder="Select company"
              options={branches.map((b) => ({
                value: b.id,
                label: b.name ?? "—",
              }))}
            />
          </FormField>
        </div>

        <div className="sm:col-span-2">
          <FormField label="Plan (from your plan list)">
            <Combobox
              value={form.planId}
              onChange={(v) => applyPlan(v)}
              placeholder="Pick a plan to auto-fill — or enter custom below"
              options={plans
                .filter((p) => p.isActive)
                .map((p) => ({
                  value: p.id,
                  label: p.name ?? "—",
                }))}
            />
          </FormField>
        </div>

        <FormField label="Plan Name" required htmlFor="sub-plan">
          <Input
            id="sub-plan"
            required
            value={form.planName}
            onChange={(e) => update("planName", e.target.value)}
            placeholder="e.g. Pro, Basic, Enterprise"
          />
        </FormField>

        <FormField label="Billing Cycle" required>
          <Select
            value={form.billingCycle}
            onChange={(e) => handleCycle(e.target.value as BillingCycle)}
          >
            {CYCLES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Price" required htmlFor="sub-price">
          <Input
            id="sub-price"
            type="number"
            min={0}
            step="0.01"
            required
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            placeholder="0.00"
          />
        </FormField>

        <FormField label="Currency" required>
          <Select
            value={form.currency}
            onChange={(e) => update("currency", e.target.value)}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Start Date" required htmlFor="sub-start">
          <Input
            id="sub-start"
            type="date"
            required
            value={form.startDate}
            onChange={(e) => handleStart(e.target.value)}
          />
        </FormField>

        {isLifetime ? (
          <FormField label="End Date">
            <Input value="No expiry (lifetime)" disabled />
          </FormField>
        ) : (
          <FormField label="End Date" required htmlFor="sub-end">
            <Input
              id="sub-end"
              type="date"
              required
              value={form.endDate}
              min={form.startDate || undefined}
              onChange={(e) => {
                setEndDateTouched(true)
                update("endDate", e.target.value)
              }}
            />
          </FormField>
        )}

        <div className="sm:col-span-2">
          <FormField label="Notes" htmlFor="sub-notes">
            <Textarea
              id="sub-notes"
              rows={2}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Optional — discount, contact, terms…"
            />
          </FormField>
        </div>

        <div className="sm:col-span-2 flex items-center justify-between rounded-md border bg-muted/30 px-3 py-1.5">
          <Label className="text-sm font-medium">Active</Label>
          <Switch
            checked={form.isActive}
            onCheckedChange={(v) => update("isActive", v)}
          />
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Saving…
            </>
          ) : isEdit ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}
