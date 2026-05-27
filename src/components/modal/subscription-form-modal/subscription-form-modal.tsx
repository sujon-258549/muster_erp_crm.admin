import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
  useMainBranch,
  useSubscription,
  useSubscriptionPlan,
} from "@/hooks/data-fetch"
import type { Subscription } from "@/redux/features/subscriptions"
import type { SubscriptionPlan } from "@/redux/features/subscription-plans"
import { addCycleToDate } from "@/lib/billing-cycles"
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
  startDate: string
  endDate: string
  notes: string
  isActive: boolean
}

const todayIso = () => new Date().toISOString().slice(0, 10)

const computeEnd = (
  startIso: string,
  plan: SubscriptionPlan | undefined,
): string => {
  if (!plan?.billingCycle) return ""
  return addCycleToDate(startIso, plan.billingCycle)
}

function makeInitial(initial: Subscription | null): FormState {
  if (!initial) {
    return {
      branchId: "",
      planId: "",
      startDate: todayIso(),
      endDate: "",
      notes: "",
      isActive: true,
    }
  }
  return {
    branchId: initial.branchId ?? "",
    planId: initial.planId ?? "",
    startDate: initial.startDate?.slice(0, 10) ?? todayIso(),
    endDate: initial.endDate?.slice(0, 10) ?? "",
    notes: initial.notes ?? "",
    isActive: initial.isActive,
  }
}

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
  const { mainBranches } = useMainBranch({ limit: 200 })
  const { plans } = useSubscriptionPlan({ limit: 200 })
  const { createSubscription, updateSubscription, isLoading } = useSubscription()
  const isEdit = Boolean(initial?.id)

  const selectedPlan = plans.find((p) => p.id === form.planId)
  const isLifetime = selectedPlan?.billingCycle === "lifetime"

  // Has the user overridden the auto-computed end date? If yes, stop
  // recalculating it on plan / start changes.
  const [endDateTouched, setEndDateTouched] = useState(false)

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  const handlePlan = (planId: string) => {
    const plan = plans.find((p) => p.id === planId)
    setForm((prev) => ({
      ...prev,
      planId,
      endDate: endDateTouched ? prev.endDate : computeEnd(prev.startDate, plan),
    }))
  }

  const handleStart = (v: string) => {
    setForm((prev) => ({
      ...prev,
      startDate: v,
      endDate: endDateTouched ? prev.endDate : computeEnd(v, selectedPlan),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.branchId) return toast.error("Select a company / branch")
    if (!form.planId) return toast.error("Select a plan")
    if (!form.startDate) return toast.error("Start date is required")
    if (!isLifetime) {
      if (!form.endDate) return toast.error("End date is required")
      if (form.endDate < form.startDate)
        return toast.error("End date must be after start date")
    }

    const payload = {
      branchId: form.branchId,
      planId: form.planId,
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
          Assign a plan to a company. Plan defines price &amp; cycle; here we
          set the dates.
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
              options={mainBranches.map((b) => ({
                value: b.id,
                label: b.name ?? "—",
              }))}
            />
          </FormField>
        </div>

        <div className="sm:col-span-2">
          <FormField label="Plan" required>
            <Combobox
              value={form.planId}
              onChange={handlePlan}
              placeholder="Pick a plan"
              options={plans
                .filter((p) => p.isActive)
                .map((p) => ({
                  value: p.id,
                  label: p.name ?? "—",
                }))}
            />
          </FormField>
        </div>

        {selectedPlan && (
          <div className="sm:col-span-2 rounded-md border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {selectedPlan.currency} {selectedPlan.price}
            </span>
            {" · "}
            <span className="capitalize">
              {selectedPlan.billingCycle?.replace("-", " ")}
            </span>
            {selectedPlan.description ? ` · ${selectedPlan.description}` : ""}
          </div>
        )}

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
