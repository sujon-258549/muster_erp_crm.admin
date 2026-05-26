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
import { useDesignation } from "@/hooks/data-fetch"
import type { Designation } from "@/redux/features/designations"
import { getErrorMessage } from "@/lib/errors"

interface DesignationFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: Designation | null
  onCreated?: (designation: Designation) => void
}

export function DesignationFormModal({
  open,
  onOpenChange,
  initial,
  onCreated,
}: DesignationFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DesignationForm
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
  isActive: boolean
}

function makeInitial(initial: Designation | null): FormState {
  if (!initial) return { name: "", description: "", isActive: true }
  return {
    name: initial.name ?? "",
    description: initial.description ?? "",
    isActive: initial.isActive,
  }
}

function DesignationForm({
  initial,
  onClose,
  onCreated,
}: {
  initial: Designation | null
  onClose: () => void
  onCreated?: (designation: Designation) => void
}) {
  const [form, setForm] = useState<FormState>(() => makeInitial(initial))
  const { createDesignation, updateDesignation, isLoading } = useDesignation()
  const isEdit = Boolean(initial?.id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error("Name is required")
      return
    }
    try {
      if (isEdit && initial) {
        await updateDesignation({
          id: initial.id,
          data: {
            name: form.name.trim(),
            description: form.description.trim() || undefined,
            isActive: form.isActive,
          },
        }).unwrap()
        toast.success("Designation updated")
      } else {
        const res = await createDesignation({
          name: form.name.trim(),
          description: form.description.trim() || undefined,
          isActive: form.isActive,
        }).unwrap()
        toast.success("Designation created")
        if (res?.data) onCreated?.(res.data)
      }
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save designation"))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {isEdit ? "Edit Designation" : "Create Designation"}
        </DialogTitle>
        <DialogDescription>
          Job titles assigned to employees — e.g. Software Engineer.
        </DialogDescription>
      </DialogHeader>

      <div className="my-4 space-y-4">
        <FormField label="Name" required htmlFor="desig-name">
          <Input
            id="desig-name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Senior Software Engineer"
          />
        </FormField>
        <FormField label="Description" htmlFor="desig-desc">
          <Textarea
            id="desig-desc"
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="Brief description of the designation…"
          />
        </FormField>
        <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
          <div>
            <Label className="text-sm font-medium">Active</Label>
            <Text size="xs" tone="muted">
              Disabled designations are hidden from create forms.
            </Text>
          </div>
          <Switch
            checked={form.isActive}
            onCheckedChange={(v) => setForm({ ...form, isActive: v })}
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
