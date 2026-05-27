import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormField, Text } from "@/components/shared"
import { useMainBranch } from "@/hooks/data-fetch"
import type { MainBranch } from "@/redux/features/main-mainBranches"
import { getErrorMessage } from "@/lib/errors"

interface BranchFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: MainBranch | null
  onCreated?: (branch: MainBranch) => void
}

export function MainBranchFormModal({
  open,
  onOpenChange,
  initial,
  onCreated,
}: BranchFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* `overflow-hidden` on the outer keeps the close button anchored
          to the modal top; scrolling happens on the inner wrapper. */}
      <DialogContent className="flex max-h-[90vh] w-300 max-w-[95vw] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <BranchForm
            key={initial?.id ?? "new"}
            initial={initial ?? null}
            onClose={() => onOpenChange(false)}
            onCreated={onCreated}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface FormState {
  name: string
  description: string
  email: string
  phone: string
  website: string
  address: string
  division: string
  district: string
  upazila: string
  industry: string
  businessType: string
  registrationNo: string
  taxId: string
  currency: string
  timezone: string
  isActive: boolean
}

const makeInitial = (b: MainBranch | null): FormState => ({
  name: b?.name ?? "",
  description: b?.description ?? "",
  email: b?.email ?? "",
  phone: b?.phone ?? "",
  website: b?.website ?? "",
  address: b?.address ?? "",
  division: b?.division ?? "",
  district: b?.district ?? "",
  upazila: b?.upazila ?? "",
  industry: b?.industry ?? "",
  businessType: b?.businessType ?? "",
  registrationNo: b?.registrationNo ?? "",
  taxId: b?.taxId ?? "",
  currency: b?.currency ?? "",
  timezone: b?.timezone ?? "",
  isActive: b?.isActive ?? true,
})

function BranchForm({
  initial,
  onClose,
  onCreated,
}: {
  initial: MainBranch | null
  onClose: () => void
  onCreated?: (branch: MainBranch) => void
}) {
  const [form, setForm] = useState<FormState>(() => makeInitial(initial))
  const { createMainBranch, updateMainBranch, isLoading } = useMainBranch()
  const isEdit = Boolean(initial?.id)

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((s) => ({ ...s, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error("Branch name is required")
      return
    }

    const trim = (v: string) => (v.trim() ? v.trim() : undefined)
    const payload = {
      name: form.name.trim(),
      description: trim(form.description),
      email: trim(form.email),
      phone: trim(form.phone),
      website: trim(form.website),
      address: trim(form.address),
      division: trim(form.division),
      district: trim(form.district),
      upazila: trim(form.upazila),
      industry: trim(form.industry),
      businessType: trim(form.businessType),
      registrationNo: trim(form.registrationNo),
      taxId: trim(form.taxId),
      currency: trim(form.currency),
      timezone: trim(form.timezone),
      isActive: form.isActive,
    }

    try {
      if (isEdit && initial) {
        await updateMainBranch({ id: initial.id, data: payload }).unwrap()
        toast.success("Branch updated")
      } else {
        const res = await createMainBranch(payload).unwrap()
        toast.success("Branch created")
        if (res?.data) onCreated?.(res.data)
      }
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save branch"))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit Branch" : "Create Branch"}</DialogTitle>
        <DialogDescription>
          Branch represents a top-level location — head office, regional
          office, or outlet.
        </DialogDescription>
      </DialogHeader>

      <div className="my-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FormField label="Name" required>
            <Input
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Dhaka Head Office"
            />
          </FormField>
        </div>
        <div className="sm:col-span-2">
          <FormField label="Description">
            <Textarea
              rows={2}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Short branch description…"
            />
          </FormField>
        </div>

        <FormField label="Email">
          <Input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="branch@company.com"
          />
        </FormField>
        <FormField label="Phone">
          <Input
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+8801XXXXXXXXX"
          />
        </FormField>
        <FormField label="Website">
          <Input
            value={form.website}
            onChange={(e) => update("website", e.target.value)}
            placeholder="https://example.com"
          />
        </FormField>
        <FormField label="Industry">
          <Input
            value={form.industry}
            onChange={(e) => update("industry", e.target.value)}
            placeholder="e.g. Retail"
          />
        </FormField>

        <div className="sm:col-span-2">
          <FormField label="Address">
            <Input
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="House, road, area, landmark…"
            />
          </FormField>
        </div>

        <FormField label="Division">
          <Input
            value={form.division}
            onChange={(e) => update("division", e.target.value)}
            placeholder="Dhaka"
          />
        </FormField>
        <FormField label="District">
          <Input
            value={form.district}
            onChange={(e) => update("district", e.target.value)}
            placeholder="Dhaka"
          />
        </FormField>
        <FormField label="Upazila">
          <Input
            value={form.upazila}
            onChange={(e) => update("upazila", e.target.value)}
            placeholder="Mirpur"
          />
        </FormField>

        <FormField label="Business Type">
          <Input
            value={form.businessType}
            onChange={(e) => update("businessType", e.target.value)}
            placeholder="e.g. Pvt. Ltd."
          />
        </FormField>
        <FormField label="Registration No.">
          <Input
            value={form.registrationNo}
            onChange={(e) => update("registrationNo", e.target.value)}
            placeholder="Govt. registration"
          />
        </FormField>
        <FormField label="Tax ID">
          <Input
            value={form.taxId}
            onChange={(e) => update("taxId", e.target.value)}
            placeholder="TIN / VAT"
          />
        </FormField>
        <FormField label="Currency">
          <Input
            value={form.currency}
            onChange={(e) => update("currency", e.target.value)}
            placeholder="BDT"
          />
        </FormField>
        <FormField label="Timezone">
          <Input
            value={form.timezone}
            onChange={(e) => update("timezone", e.target.value)}
            placeholder="Asia/Dhaka"
          />
        </FormField>

        <div className="sm:col-span-2">
          <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
            <div>
              <Label className="text-sm font-medium">Active</Label>
              <Text size="xs" tone="muted">
                Inactive mainBranches are hidden from selection lists.
              </Text>
            </div>
            <Switch
              checked={form.isActive}
              onCheckedChange={(v) => update("isActive", v)}
            />
          </div>
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
          {isLoading && <Loader2 className="size-4 animate-spin" />}
          {isEdit ? "Update MainBranch" : "Create Branch"}
        </Button>
      </DialogFooter>
    </form>
  )
}
