// Employee/user domain types. The backend route is `/users` so we keep that
// folder name, but in product language these records are "employees".

import type { User, UserRole } from "@/types/user"

export interface CreateEmployeePayload {
  user: {
    email: string
    password: string
    mobile?: string
    roleId?: string
    departmentId?: string
    designationId?: string
    branchId?: string
    isActive?: boolean
  }
  profile?: {
    name?: string
    gender?: "MALE" | "FEMALE" | "OTHER"
    dob?: string
    bloodGroup?: string
    nid?: string
  }
  address?: {
    division?: string
    district?: string
    upazila?: string
    address?: string
  }
  workInfo?: {
    experience?: string
    workType?: string
    workStartTime?: string
    workTimeLimit?: string
    availableTime?: string
  }
}

export interface UpdateUserPayload {
  name?: string
  email?: string
  phone?: string
  designation?: string
  department?: string
  role?: UserRole
}

export interface ChangePasswordPayload {
  oldPassword: string
  newPassword: string
}

export interface VerifyOtpPayload {
  email: string
  otp: string
}

export interface ListUsersParams {
  page?: number
  limit?: number
  searchTerm?: string
  role?: UserRole
}

// Backend returns nested User shape — flatten to a row the table can render.
export interface EmployeeRow extends User {
  mobile?: string | null
  isActive?: boolean
  isBlocked?: boolean
  isDeleted?: boolean
  departmentName?: string | null
  designationName?: string | null
}
