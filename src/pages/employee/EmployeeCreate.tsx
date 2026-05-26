import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Briefcase,
  Building,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  UserCircle2,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { FormField, PageHeader, Text } from "@/components/shared"
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
import { ROUTES } from "@/config/paths"
import { getErrorMessage } from "@/lib/errors"

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

const initialState: FormState = {
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

export default function EmployeeCreatePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(initialState)
  const [showPassword, setShowPassword] = useState(false)
  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const [deptModalOpen, setDeptModalOpen] = useState(false)
  const [desigModalOpen, setDesigModalOpen] = useState(false)

  const { roles } = useRole({ limit: 100 })
  const { departments } = useDepartment({ limit: 100 })
  const { designations } = useDesignation({ limit: 100 })
  const { createEmployee, isLoading } = useEmployee()

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((s) => ({ ...s, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email.trim() || !form.password.trim()) {
      toast.error("Email and password are required")
      return
    }

    try {
      await createEmployee({
        user: {
          email: form.email.trim(),
          password: form.password,
          mobile: form.mobile.trim() || undefined,
          roleId: form.roleId || undefined,
          departmentId: form.departmentId || undefined,
          designationId: form.designationId || undefined,
          isActive: form.isActive,
        },
        profile: {
          name: form.name.trim() || undefined,
          gender: (form.gender as "MALE" | "FEMALE" | "OTHER") || undefined,
          dob: form.dob || undefined,
          bloodGroup: form.bloodGroup || undefined,
          nid: form.nid.trim() || undefined,
        },
        address: {
          division: form.division.trim() || undefined,
          district: form.district.trim() || undefined,
          upazila: form.upazila.trim() || undefined,
          address: form.address.trim() || undefined,
        },
        workInfo: {
          experience: form.experience.trim() || undefined,
          workType: form.workType.trim() || undefined,
        },
      }).unwrap()
      toast.success("Employee created successfully")
      navigate(ROUTES.EMPLOYEES.LIST)
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create employee"))
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Employee"
        description="Onboard a new team member with role, designation, department and contact details."
        actions={
          <Button variant="outline" asChild>
            <Link to={ROUTES.EMPLOYEES.LIST}>
              <ArrowLeft className="mr-1 size-4" /> Back to list
            </Link>
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle2 className="size-4 text-primary" /> Personal Info
              </CardTitle>
              <CardDescription>
                Basic identification and contact details.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField label="Full Name" required>
                <Input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. Sujon Ahmed"
                />
              </FormField>
              <FormField label="Email" required>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    required
                    className="pl-9"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="employee@company.com"
                  />
                </div>
              </FormField>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-4 text-primary" /> Address
              </CardTitle>
              <CardDescription>Where the employee is based.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
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
              <div className="sm:col-span-3">
                <FormField label="Full Address">
                  <Textarea
                    rows={2}
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder="House, road, area, landmark…"
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="size-4 text-primary" /> Work Info
              </CardTitle>
              <CardDescription>
                Optional — used by reports and rostering.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
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
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="size-4 text-primary" /> Organization
              </CardTitle>
              <CardDescription>
                Set the role, department and designation.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>
                Inactive employees can&apos;t log in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
                <div>
                  <Label htmlFor="isActive" className="text-sm font-medium">
                    Active account
                  </Label>
                  <Text size="xs" tone="muted">
                    Allow this employee to sign in.
                  </Text>
                </div>
                <Switch
                  id="isActive"
                  checked={form.isActive}
                  onCheckedChange={(v) => update("isActive", v)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save className="size-4" /> Save Employee
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setForm(initialState)}
              disabled={isLoading}
            >
              Reset
            </Button>
          </div>
        </div>
      </form>

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
    </div>
  )
}
