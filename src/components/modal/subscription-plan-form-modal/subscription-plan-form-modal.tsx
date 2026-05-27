import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormField } from "@/components/shared"
import { useSubscriptionPlan } from "@/hooks/data-fetch"
import type { SubscriptionPlan } from "@/redux/features/subscription-plans"
import type { BillingCycle } from "@/redux/features/subscriptions"
import { BILLING_CYCLE_OPTIONS, cycleToMonths } from "@/lib/billing-cycles"
import { getErrorMessage } from "@/lib/errors"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: SubscriptionPlan | null
  onCreated?: (plan: SubscriptionPlan) => void
}

export function SubscriptionPlanFormModal({
  open,
  onOpenChange,
  initial,
  onCreated,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl md:max-w-3xl">
        <PlanForm
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
  name: string
  description: string
  price: string
  currency: string
  billingCycle: BillingCycle
  features: string
  isActive: boolean
}

function makeInitial(initial: SubscriptionPlan | null): FormState {
  if (!initial)
    return {
      name: "",
      description: "",
      price: "",
      currency: "BDT",
      billingCycle: "1-month",
      features: "",
      isActive: true,
    }
  return {
    name: initial.name ?? "",
    description: initial.description ?? "",
    price: initial.price != null ? String(initial.price) : "",
    currency: initial.currency ?? "BDT",
    billingCycle: initial.billingCycle ?? "1-month",
    features: (initial.features ?? []).join("\n"),
    isActive: initial.isActive,
  }
}

const CURRENCIES = ["BDT", "USD", "EUR", "INR"] as const

function PlanForm({
  initial,
  onClose,
  onCreated,
}: {
  initial: SubscriptionPlan | null
  onClose: () => void
  onCreated?: (plan: SubscriptionPlan) => void
}) {
  const [form, setForm] = useState<FormState>(() => makeInitial(initial))
  const { createPlan, updatePlan, isLoading } = useSubscriptionPlan()
  const isEdit = Boolean(initial?.id)

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return toast.error("Plan name is required")
    const priceNum = Number(form.price)
    if (!form.price || Number.isNaN(priceNum) || priceNum < 0)
      return toast.error("Enter a valid price")

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      price: priceNum,
      currency: form.currency,
      billingCycle: form.billingCycle,
      durationMonths: cycleToMonths(form.billingCycle),
      features: form.features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      isActive: form.isActive,
    }

    try {
      if (isEdit && initial) {
        await updatePlan({ id: initial.id, data: payload }).unwrap()
        toast.success("Plan updated")
      } else {
        const res = await createPlan(payload).unwrap()
        toast.success("Plan created")
        if (res?.data) onCreated?.(res.data)
      }
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save plan"))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit Plan" : "Create Plan"}</DialogTitle>
        <DialogDescription>
          Reusable plan template. Companies pick from these when subscribing.
        </DialogDescription>
      </DialogHeader>

      <div className="my-3 grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FormField label="Plan Name" required htmlFor="plan-name">
            <Input
              id="plan-name"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Pro Monthly, Lifetime Enterprise"
            />
          </FormField>
        </div>

        <FormField label="Billing Cycle" required>
          <Select
            value={form.billingCycle}
            onChange={(v) => update("billingCycle", v as BillingCycle)}
          >
            {BILLING_CYCLE_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Currency" required>
          <Select
            value={form.currency}
            onChange={(v) => update("currency", v)}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </FormField>

        <div className="sm:col-span-2">
          <FormField label="Price" required htmlFor="plan-price">
            <Input
              id="plan-price"
              type="number"
              min={0}
              step="0.01"
              required
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              placeholder="0.00"
            />
          </FormField>
        </div>

        <div className="sm:col-span-2">
          <FormField label="Description" htmlFor="plan-desc">
            <Textarea
              id="plan-desc"
              rows={2}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Short summary of what this plan covers"
            />
          </FormField>
        </div>

        <div className="sm:col-span-2">
          <FormField label="Features (one per line)" htmlFor="plan-features">
            <Textarea
              id="plan-features"
              rows={3}
              value={form.features}
              onChange={(e) => update("features", e.target.value)}
              placeholder={"Unlimited employees\nMulti-branch\nPriority support"}
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
