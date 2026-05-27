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
import { FormField, Text } from "@/components/shared"
import { useMainBranch, useSubBranch } from "@/hooks/data-fetch"
import type { SubBranch } from "@/redux/features/subBranches"
import { getErrorMessage } from "@/lib/errors"

interface SubBranchFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: SubBranch | null
  onCreated?: (subBranch: SubBranch) => void
}

export function SubBranchFormModal({
  open,
  onOpenChange,
  initial,
  onCreated,
}: SubBranchFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* `overflow-hidden` on the outer keeps the close button anchored
          to the modal top; scrolling happens on the inner wrapper. */}
      <DialogContent className="flex max-h-[90vh] w-300 max-w-[95vw] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <SubBranchForm
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
  branchId: string
  name: string
  description: string
  email: string
  phone: string
  address: string
  division: string
  district: string
  upazila: string
  isActive: boolean
}

const makeInitial = (sb: SubBranch | null): FormState => ({
  branchId: sb?.branchId ?? "",
  name: sb?.name ?? "",
  description: sb?.description ?? "",
  email: sb?.email ?? "",
  phone: sb?.phone ?? "",
  address: sb?.address ?? "",
  division: sb?.division ?? "",
  district: sb?.district ?? "",
  upazila: sb?.upazila ?? "",
  isActive: sb?.isActive ?? true,
})

function SubBranchForm({
  initial,
  onClose,
  onCreated,
}: {
  initial: SubBranch | null
  onClose: () => void
  onCreated?: (subBranch: SubBranch) => void
}) {
  const [form, setForm] = useState<FormState>(() => makeInitial(initial))
  const { mainBranches } = useMainBranch({ limit: 200 })
  const { createSubBranch, updateSubBranch, isLoading } = useSubBranch()
  const isEdit = Boolean(initial?.id)

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((s) => ({ ...s, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error("Sub branch name is required")
      return
    }
    if (!isEdit && !form.branchId) {
      toast.error("Parent branch is required")
      return
    }

    const trim = (v: string) => (v.trim() ? v.trim() : undefined)

    try {
      if (isEdit && initial) {
        // Update doesn't allow branchId change (backend schema).
        await updateSubBranch({
          id: initial.id,
          data: {
            name: form.name.trim(),
            description: trim(form.description),
            email: trim(form.email),
            phone: trim(form.phone),
            address: trim(form.address),
            division: trim(form.division),
            district: trim(form.district),
            upazila: trim(form.upazila),
            isActive: form.isActive,
          },
        }).unwrap()
        toast.success("Sub branch updated")
      } else {
        const res = await createSubBranch({
          branchId: form.branchId,
          name: form.name.trim(),
          description: trim(form.description),
          email: trim(form.email),
          phone: trim(form.phone),
          address: trim(form.address),
          division: trim(form.division),
          district: trim(form.district),
          upazila: trim(form.upazila),
          isActive: form.isActive,
        }).unwrap()
        toast.success("Sub branch created")
        if (res?.data) onCreated?.(res.data)
      }
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save sub branch"))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {isEdit ? "Edit Sub Branch" : "Create Sub Branch"}
        </DialogTitle>
        <DialogDescription>
          Sub branch rolls up into a parent branch — useful for departments
          or sub-offices.
        </DialogDescription>
      </DialogHeader>

      <div className="my-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FormField label="Parent Branch" required>
            <Combobox
              value={form.branchId}
              onChange={(v) => update("branchId", v)}
              disabled={isEdit}
              placeholder="Select parent branch"
              options={mainBranches.map((b) => ({
                value: b.id,
                label: b.name ?? "—",
              }))}
            />
          </FormField>
        </div>

        <div className="sm:col-span-2">
          <FormField label="Name" required>
            <Input
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Mirpur Sub Branch"
            />
          </FormField>
        </div>

        <div className="sm:col-span-2">
          <FormField label="Description">
            <Textarea
              rows={2}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Short sub-branch description…"
            />
          </FormField>
        </div>

        <FormField label="Email">
          <Input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="sub@company.com"
          />
        </FormField>
        <FormField label="Phone">
          <Input
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+8801XXXXXXXXX"
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

        <div className="sm:col-span-2">
          <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
            <div>
              <Label className="text-sm font-medium">Active</Label>
              <Text size="xs" tone="muted">
                Inactive sub branches are hidden from selection lists.
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
          {isEdit ? "Update" : "Create"}
        </Button>
      </DialogFooter>
    </form>
  )
}
