import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  useEmployee,
  useMainBranch,
  useRole,
} from "@/hooks/data-fetch"
import { useUpdateMainBranchMutation } from "@/redux/features/main-branches"
import { useCurrentUser } from "@/hooks/use-permission"
import type { EmployeeRow } from "@/redux/features/users"
import { getErrorMessage } from "@/lib/errors"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: EmployeeRow | null
  onSaved?: (row: EmployeeRow) => void
}

export function BranchAdminFormModal({
  open,
  onOpenChange,
  initial,
  onSaved,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <BranchAdminForm
          key={initial?.id ?? "new"}
          initial={initial ?? null}
          onClose={() => onOpenChange(false)}
          onSaved={onSaved}
        />
      </DialogContent>
    </Dialog>
  )
}

interface FormState {
  branchId: string
  roleId: string
  name: string
  email: string
  password: string
  mobile: string
  isActive: boolean
}

function makeInitial(initial: EmployeeRow | null): FormState {
  if (!initial) {
    return {
      branchId: "",
      roleId: "",
      name: "",
      email: "",
      password: "",
      mobile: "",
      isActive: true,
    }
  }
  return {
    branchId: initial.branchId ?? "",
    roleId: initial.roleId ?? "",
    name: initial.name ?? "",
    email: initial.email ?? "",
    password: "",
    mobile: initial.mobile ?? "",
    isActive: initial.isActive ?? true,
  }
}

function BranchAdminForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: EmployeeRow | null
  onClose: () => void
  onSaved?: (row: EmployeeRow) => void
}) {
  const [form, setForm] = useState<FormState>(() => makeInitial(initial))
  const [showPassword, setShowPassword] = useState(false)
  const { mainBranches } = useMainBranch({ limit: 200 })
  const { roles } = useRole({ limit: 100 })
  const { createEmployee, updateEmployee, isLoading } = useEmployee()
  const [linkBranchOwner] = useUpdateMainBranchMutation()
  const isEdit = Boolean(initial?.id)
  // Backend blocks role changes on your own account — so don't send
  // roleId when editing yourself, and lock the role dropdown too.
  const currentUser = useCurrentUser()
  const isSelf = isEdit && initial?.id === currentUser?.id

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.branchId) return toast.error("Select a branch")
    if (!form.roleId) return toast.error("Select a role")
    if (!form.name.trim()) return toast.error("Name is required")
    if (!form.email.trim()) return toast.error("Email is required")
    if (!isEdit && form.password.length < 6)
      return toast.error("Password must be at least 6 characters")

    try {
      if (isEdit && initial) {
        await updateEmployee({
          id: initial.id,
          data: {
            user: {
              email: form.email.trim(),
              mobile: form.mobile.trim() || undefined,
              // Omit roleId on self-edit — backend rejects role changes
              // on your own account; sending it (even unchanged) trips
              // the guard.
              ...(isSelf ? {} : { roleId: form.roleId }),
              branchId: form.branchId,
              isActive: form.isActive,
              ...(form.password ? { password: form.password } : {}),
            },
            profile: {
              name: form.name.trim(),
            },
          },
        }).unwrap()
        // If they moved the admin to a different branch, transfer
        // ownership so the new branch picks them up as its owner.
        const branchChanged =
          (initial.branchId ?? "") !== form.branchId && !!form.branchId
        if (branchChanged) {
          try {
            await linkBranchOwner({
              id: form.branchId,
              data: { ownerId: initial.id },
            }).unwrap()
          } catch {
            toast.warning("Updated, but couldn't transfer branch ownership")
          }
        }
        toast.success("Branch Super Admin updated")
      } else {
        const res = await createEmployee({
          user: {
            email: form.email.trim(),
            password: form.password,
            mobile: form.mobile.trim() || undefined,
            roleId: form.roleId,
            branchId: form.branchId,
            isActive: form.isActive,
          },
          profile: {
            name: form.name.trim(),
          },
        }).unwrap()
        // Mark this user as the branch's owner so it shows in the
        // Branch Super Admin list (not the generic Employee list).
        const newUserId = (res?.data as { id?: string } | undefined)?.id
        if (newUserId) {
          try {
            await linkBranchOwner({
              id: form.branchId,
              data: { ownerId: newUserId },
            }).unwrap()
          } catch {
            // Non-fatal — user is created, owner link can be retried.
            toast.warning("Created, but couldn't set branch owner")
          }
        }
        toast.success("Branch Super Admin created")
        if (res?.data) onSaved?.(res.data as unknown as EmployeeRow)
      }
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save branch admin"))
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>
          {isEdit ? "Edit Branch Super Admin" : "New Branch Super Admin"}
        </DialogTitle>
        <DialogDescription>
          One admin user per customer company. Gets full access only inside
          the selected branch.
        </DialogDescription>
      </DialogHeader>

      {isEdit && initial && (
        <CurrentContext row={initial} />
      )}

      <div className="my-3 grid gap-3 sm:grid-cols-2">
        <FormField label="Branch (Company)" required>
          <Combobox
            value={form.branchId}
            onChange={(v) => update("branchId", v)}
            placeholder="Select branch"
            options={mainBranches.map((b) => ({
              value: b.id,
              label: b.name ?? "—",
            }))}
          />
        </FormField>
        <FormField label="Role" required>
          <Combobox
            value={form.roleId}
            onChange={(v) => update("roleId", v)}
            disabled={isSelf}
            placeholder={isSelf ? "Can't change your own role" : "Select role"}
            options={roles
              .filter((r) => {
                // Never let a customer admin grab the platform-level
                // SUPER_ADMIN role — they'd see every tenant's data.
                const name = (r.role ?? "")
                  .toUpperCase()
                  .replace(/[-\s]/g, "_")
                return name !== "SUPER_ADMIN" && r.isActive
              })
              .map((r) => ({
                value: r.id,
                label: r.role ?? "—",
              }))}
          />
        </FormField>

        <FormField label="Full Name" required htmlFor="ba-name">
          <Input
            id="ba-name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="e.g. Karim Ahmed"
            required
          />
        </FormField>
        <FormField label="Email" required htmlFor="ba-email">
          <Input
            id="ba-email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="owner@company.com"
            required
          />
        </FormField>

        <FormField
          label={isEdit ? "New Password (optional)" : "Password"}
          required={!isEdit}
          htmlFor="ba-password"
        >
          <div className="relative">
            <Input
              id="ba-password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder={isEdit ? "Leave blank to keep current" : "Min 6 characters"}
              required={!isEdit}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </FormField>
        <FormField label="Phone" htmlFor="ba-mobile">
          <Input
            id="ba-mobile"
            value={form.mobile}
            onChange={(e) => update("mobile", e.target.value)}
            placeholder="01XXXXXXXXX"
          />
        </FormField>

        <div className="sm:col-span-2 flex items-center justify-between rounded-md border bg-muted/30 px-3 py-1.5">
          <div>
            <Label className="text-sm font-medium">Active</Label>
            <Text size="xs" tone="muted">
              Inactive accounts can't log in.
            </Text>
          </div>
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

// Read-only summary of which branch + subscription + plan this admin is
// currently under. Helps you avoid breaking the link blindly when editing.
function CurrentContext({ row }: { row: EmployeeRow }) {
  const branch = row.branchName ?? "—"
  const plan = row.planName ?? "No active plan"
  const cycle = row.planBillingCycle
    ? ` · ${row.planBillingCycle.replace("-", " ")}`
    : ""
  const amount =
    row.planPrice != null
      ? `${row.planCurrency ?? "BDT"} ${Number(row.planPrice).toLocaleString()}`
      : ""
  const end = row.subscriptionEndDate
    ? `Expires ${new Date(row.subscriptionEndDate).toLocaleDateString()}`
    : row.planName
      ? "No expiry"
      : ""

  return (
    <div className="mb-2 rounded-md border bg-muted/40 px-3 py-2 text-xs">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span>
          <span className="text-muted-foreground">Current branch:</span>{" "}
          <span className="font-medium">{branch}</span>
        </span>
        <span>
          <span className="text-muted-foreground">Plan:</span>{" "}
          <span className="font-medium">{plan}</span>
          {amount && <span className="text-muted-foreground">{` (${amount})`}</span>}
          {cycle && <span className="text-muted-foreground capitalize">{cycle}</span>}
        </span>
        {end && (
          <span className="text-muted-foreground">{end}</span>
        )}
      </div>
    </div>
  )
}
