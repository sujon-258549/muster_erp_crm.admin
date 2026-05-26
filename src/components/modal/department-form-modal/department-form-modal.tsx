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
import { useDepartment } from "@/hooks/data-fetch"
import type { Department } from "@/redux/features/departments"
import { getErrorMessage } from "@/lib/errors"

interface DepartmentFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: Department | null
  onCreated?: (dept: Department) => void
}

export function DepartmentFormModal({
  open,
  onOpenChange,
  initial,
  onCreated,
}: DepartmentFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {/* Keying the inner form on the row id (or "new") forces a fresh
            mount when switching between create and edit — so form state
            initializes from props instead of via an effect. */}
        <DepartmentForm
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

function makeInitial(initial: Department | null): FormState {
  if (!initial) return { name: "", description: "", isActive: true }
  return {
    name: initial.name ?? "",
    description: initial.description ?? "",
    isActive: initial.isActive,
  }
}

function DepartmentForm({
  initial,
  onClose,
  onCreated,
}: {
  initial: Department | null
  onClose: () => void
  onCreated?: (dept: Department) => void
}) {
  const [form, setForm] = useState<FormState>(() => makeInitial(initial))
  const { createDepartment, updateDepartment, isLoading } = useDepartment()
  const isEdit = Boolean(initial?.id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error("Name is required")
      return
    }
    try {
      if (isEdit && initial) {
        await updateDepartment({
          id: initial.id,
          data: {
            name: form.name.trim(),
            description: form.description.trim() || undefined,
            isActive: form.isActive,
          },
        }).unwrap()
        toast.success("Department updated")
      } else {
        const res = await createDepartment({
          name: form.name.trim(),
          description: form.description.trim() || undefined,
          isActive: form.isActive,
        }).unwrap()
        toast.success("Department created")
        if (res?.data) onCreated?.(res.data)
      }
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save department"))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {isEdit ? "Edit Department" : "Create Department"}
        </DialogTitle>
        <DialogDescription>
          Departments help group employees by function.
        </DialogDescription>
      </DialogHeader>

      <div className="my-4 space-y-4">
        <FormField label="Name" required htmlFor="dept-name">
          <Input
            id="dept-name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Engineering"
          />
        </FormField>
        <FormField label="Description" htmlFor="dept-desc">
          <Textarea
            id="dept-desc"
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="What this department is responsible for…"
          />
        </FormField>
        <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
          <div>
            <Label className="text-sm font-medium">Active</Label>
            <Text size="xs" tone="muted">
              Disabled departments cannot be assigned to new employees.
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
