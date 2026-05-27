import { useState } from "react"
import {
  Briefcase,
  Building,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  MapPin,
  Phone,
  UserCircle2,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { FormField, Text } from "@/components/shared"
import {
  DepartmentFormModal,
  DesignationFormModal,
  RoleFormModal,
} from "@/components/modal"
import {
  useDepartment,
  useDesignation,
  useEmployee,
  useRole,
} from "@/hooks/data-fetch"
import { getErrorMessage } from "@/lib/errors"
import type { EmployeeRow } from "@/redux/features/users"

interface EmployeeFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  // Pass an employee row to enter edit mode; omit / null for create mode.
  initial?: EmployeeRow | null
}

export function EmployeeFormModal({
  open,
  onOpenChange,
  initial,
}: EmployeeFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[95vh] w-[90vw] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl">
        <EmployeeForm
          key={initial?.id ?? "new"}
          initial={initial ?? null}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

interface FormState {
  name: string
  email: string
  password: string
  mobile: string
  gender: string
  dob: string
  bloodGroup: string
  nid: string
  roleId: string
  departmentId: string
  designationId: string
  division: string
  district: string
  upazila: string
  address: string
  experience: string
  workType: string
  isActive: boolean
}

const BLOOD_GROUPS = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
] as const

function makeInitial(initial: EmployeeRow | null): FormState {
  if (!initial) {
    return {
      name: "",
      email: "",
      password: "",
      mobile: "",
      gender: "",
      dob: "",
      bloodGroup: "",
      nid: "",
      roleId: "",
      departmentId: "",
      designationId: "",
      division: "",
      district: "",
      upazila: "",
      address: "",
      experience: "",
      workType: "",
      isActive: true,
    }
  }
  // EmployeeRow only carries the row-table fields, so prefill what we have.
  // The backend update merges partial sections, so missing fields stay as-is.
  const raw = initial as unknown as Record<string, any>
  return {
    name: initial.name ?? "",
    email: initial.email ?? "",
    password: "",
    mobile: initial.mobile ?? "",
    gender: raw?.profile?.gender ?? "",
    dob: raw?.profile?.dob ? String(raw.profile.dob).slice(0, 10) : "",
    bloodGroup: raw?.profile?.bloodGroup ?? "",
    nid: raw?.profile?.nid ?? "",
    roleId: raw?.role?.id ?? raw?.roleId ?? "",
    departmentId: raw?.department?.id ?? raw?.departmentId ?? "",
    designationId: raw?.designation?.id ?? raw?.designationId ?? "",
    division: raw?.address?.division ?? "",
    district: raw?.address?.district ?? "",
    upazila: raw?.address?.upazila ?? "",
    address: raw?.address?.address ?? "",
    experience: raw?.workInfo?.experience ?? "",
    workType: raw?.workInfo?.workType ?? "",
    isActive: initial.isActive ?? true,
  }
}

function EmployeeForm({
  initial,
  onClose,
}: {
  initial: EmployeeRow | null
  onClose: () => void
}) {
  const isEdit = Boolean(initial?.id)
  const [form, setForm] = useState<FormState>(() => makeInitial(initial))
  const [showPassword, setShowPassword] = useState(false)
  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const [deptModalOpen, setDeptModalOpen] = useState(false)
  const [desigModalOpen, setDesigModalOpen] = useState(false)

  const { roles } = useRole({ limit: 100 })
  const { departments } = useDepartment({ limit: 100 })
  const { designations } = useDesignation({ limit: 100 })
  const { createEmployee, updateEmployee, isLoading } = useEmployee()

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((s) => ({ ...s, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isEdit && (!form.email.trim() || !form.password.trim())) {
      toast.error("Email and password are required")
      return
    }

    // Trim helpers — `undefined` lets the backend update merge leave a
    // section untouched, instead of overwriting with empty strings.
    const trimOrU = (v: string) => (v.trim() ? v.trim() : undefined)

    const userSection = {
      email: trimOrU(form.email),
      mobile: trimOrU(form.mobile),
      roleId: form.roleId || undefined,
      departmentId: form.departmentId || undefined,
      designationId: form.designationId || undefined,
      isActive: form.isActive,
    }

    const profileSection = {
      name: trimOrU(form.name),
      gender: (form.gender as "MALE" | "FEMALE" | "OTHER") || undefined,
      dob: form.dob || undefined,
      bloodGroup: form.bloodGroup || undefined,
      nid: trimOrU(form.nid),
    }

    const addressSection = {
      division: trimOrU(form.division),
      district: trimOrU(form.district),
      upazila: trimOrU(form.upazila),
      address: trimOrU(form.address),
    }

    const workInfoSection = {
      experience: trimOrU(form.experience),
      workType: trimOrU(form.workType),
    }

    try {
      if (isEdit && initial) {
        await updateEmployee({
          id: initial.id,
          data: {
            user: userSection,
            profile: profileSection,
            address: addressSection,
            workInfo: workInfoSection,
          },
        }).unwrap()
        toast.success("Employee updated")
      } else {
        await createEmployee({
          user: {
            ...userSection,
            email: form.email.trim(),
            password: form.password,
          },
          profile: profileSection,
          address: addressSection,
          workInfo: workInfoSection,
        }).unwrap()
        toast.success("Employee created")
      }
      onClose()
    } catch (err) {
      toast.error(
        getErrorMessage(err, isEdit ? "Failed to update" : "Failed to create"),
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col">
      <div className="shrink-0 border-b border-border px-6 pt-6 pb-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCircle2 className="size-5 text-primary" />
            {isEdit ? "Edit Employee" : "Create Employee"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update personal, work, and organization info. Leave any field blank to keep its current value."
              : "Onboard a new team member with role, designation, department and contact details."}
          </DialogDescription>
        </DialogHeader>
      </div>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-4">
        <Section
          icon={<UserCircle2 className="size-4 text-primary" />}
          title="Personal Info"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Full Name" required={!isEdit}>
              <Input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Sujon Ahmed"
              />
            </FormField>
            <FormField label="Email" required={!isEdit}>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  required={!isEdit}
                  className="pl-9"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="employee@company.com"
                />
              </div>
            </FormField>

            {!isEdit && (
              <FormField label="Password" required>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    placeholder="At least 6 characters"
                    className="pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </FormField>
            )}

            <FormField label="Mobile">
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  value={form.mobile}
                  onChange={(e) => update("mobile", e.target.value)}
                  placeholder="+8801XXXXXXXXX"
                />
              </div>
            </FormField>
            <FormField label="Gender">
              <Combobox
                value={form.gender}
                onChange={(value) => update("gender", value)}
                placeholder="Select gender"
                options={[
                  { value: "MALE", label: "Male" },
                  { value: "FEMALE", label: "Female" },
                  { value: "OTHER", label: "Other" },
                ]}
              />
            </FormField>
            <FormField label="Date of Birth">
              <Input
                type="date"
                value={form.dob}
                onChange={(e) => update("dob", e.target.value)}
              />
            </FormField>
            <FormField label="Blood Group">
              <Combobox
                value={form.bloodGroup}
                onChange={(value) => update("bloodGroup", value)}
                placeholder="Select blood group"
                options={BLOOD_GROUPS.map((b) => ({
                  value: b,
                  label: b
                    .replace("_", " ")
                    .replace("POSITIVE", "+")
                    .replace("NEGATIVE", "−"),
                }))}
              />
            </FormField>
            <FormField label="NID">
              <Input
                value={form.nid}
                onChange={(e) => update("nid", e.target.value)}
                placeholder="National ID number"
              />
            </FormField>
          </div>
        </Section>

        <Section
          icon={<Building className="size-4 text-primary" />}
          title="Organization"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Role">
              <Combobox
                value={form.roleId}
                onChange={(value) => update("roleId", value)}
                placeholder="Select role"
                options={roles.map((r) => ({
                  value: r.id,
                  label: r.role ?? "—",
                }))}
                onAddNew={() => setRoleModalOpen(true)}
                addNewLabel="Add new role"
              />
            </FormField>
            <FormField label="Department">
              <Combobox
                value={form.departmentId}
                onChange={(value) => update("departmentId", value)}
                placeholder="Select department"
                options={departments.map((d) => ({
                  value: d.id,
                  label: d.name ?? "—",
                }))}
                onAddNew={() => setDeptModalOpen(true)}
                addNewLabel="Add new department"
              />
            </FormField>
            <FormField label="Designation">
              <Combobox
                value={form.designationId}
                onChange={(value) => update("designationId", value)}
                placeholder="Select designation"
                options={designations.map((d) => ({
                  value: d.id,
                  label: d.name,
                }))}
                onAddNew={() => setDesigModalOpen(true)}
                addNewLabel="Add new designation"
              />
            </FormField>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
            <div>
              <Label className="text-sm font-medium">Active account</Label>
              <Text size="xs" tone="muted">
                Inactive employees can&apos;t sign in.
              </Text>
            </div>
            <Switch
              checked={form.isActive}
              onCheckedChange={(v) => update("isActive", v)}
            />
          </div>
        </Section>

        <Section
          icon={<MapPin className="size-4 text-primary" />}
          title="Address"
        >
          <div className="grid gap-4 sm:grid-cols-3">
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
          </div>
          <div className="mt-4">
            <FormField label="Full Address">
              <Textarea
                rows={2}
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="House, road, area, landmark…"
              />
            </FormField>
          </div>
        </Section>

        <Section
          icon={<Briefcase className="size-4 text-primary" />}
          title="Work Info"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Experience">
              <Input
                value={form.experience}
                onChange={(e) => update("experience", e.target.value)}
                placeholder="e.g. 3 years"
              />
            </FormField>
            <FormField label="Work Type">
              <Input
                value={form.workType}
                onChange={(e) => update("workType", e.target.value)}
                placeholder="e.g. Full-time, On-site"
              />
            </FormField>
          </div>
        </Section>
      </div>

      <DialogFooter className="shrink-0 border-t border-border bg-muted/20 px-6 py-3">
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
          {isEdit ? "Update Employee" : "Save Employee"}
        </Button>
      </DialogFooter>

      <RoleFormModal
        open={roleModalOpen}
        onOpenChange={setRoleModalOpen}
        onCreated={(role) => update("roleId", role.id)}
      />
      <DepartmentFormModal
        open={deptModalOpen}
        onOpenChange={setDeptModalOpen}
        onCreated={(dept) => update("departmentId", dept.id)}
      />
      <DesignationFormModal
        open={desigModalOpen}
        onOpenChange={setDesigModalOpen}
        onCreated={(d) => update("designationId", d.id)}
      />
    </form>
  )
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        {icon} {title}
      </h3>
      {children}
    </section>
  )
}
