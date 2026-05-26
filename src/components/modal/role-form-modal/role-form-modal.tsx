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
import { useRole } from "@/hooks/data-fetch"
import type { Role } from "@/redux/features/roles"
import { getErrorMessage } from "@/lib/errors"

interface RoleFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: Role | null
  onCreated?: (role: Role) => void
}

export function RoleFormModal({
  open,
  onOpenChange,
  initial,
  onCreated,
}: RoleFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <RoleForm
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
  role: string
  description: string
  isActive: boolean
}

function makeInitial(initial: Role | null): FormState {
  if (!initial) return { role: "", description: "", isActive: true }
  return {
    role: initial.role ?? "",
    description: initial.description ?? "",
    isActive: initial.isActive,
  }
}

function RoleForm({
  initial,
  onClose,
  onCreated,
}: {
  initial: Role | null
  onClose: () => void
  onCreated?: (role: Role) => void
}) {
  const [form, setForm] = useState<FormState>(() => makeInitial(initial))
  const { createRole, updateRole, isLoading } = useRole()
  const isEdit = Boolean(initial?.id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.role.trim()) {
      toast.error("Role name is required")
      return
    }
    try {
      if (isEdit && initial) {
        await updateRole({
          id: initial.id,
          data: {
            role: form.role.trim(),
            description: form.description.trim() || undefined,
            isActive: form.isActive,
          },
        }).unwrap()
        toast.success("Role updated")
      } else {
        const res = await createRole({
          role: form.role.trim(),
          description: form.description.trim() || undefined,
          isActive: form.isActive,
        }).unwrap()
        toast.success("Role created")
        if (res?.data) onCreated?.(res.data)
      }
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save role"))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit Role" : "Create Role"}</DialogTitle>
        <DialogDescription>
          Use clear names (e.g. ADMIN, MANAGER, STAFF).
        </DialogDescription>
      </DialogHeader>

      <div className="my-4 space-y-4">
        <FormField label="Role" required htmlFor="role-name">
          <Input
            id="role-name"
            required
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            placeholder="e.g. MANAGER"
          />
        </FormField>
        <FormField label="Description" htmlFor="role-desc">
          <Textarea
            id="role-desc"
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="What this role can do…"
          />
        </FormField>
        <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
          <div>
            <Label className="text-sm font-medium">Active</Label>
            <Text size="xs" tone="muted">
              Disabled roles can&apos;t be assigned to employees.
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
