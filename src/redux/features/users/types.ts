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

// Mirror of CreateEmployeePayload but every section is optional and
// password isn't required on edit. The backend `updateUser` service merges
// the partial shape into the existing user.
export interface UpdateUserPayload {
  user?: {
    email?: string
    password?: string
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
  }
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
  gender?: string | null
  bloodGroup?: string | null
  dob?: string | null
  nid?: string | null
  experience?: string | null
  workType?: string | null
  branchId?: string | null
  branchName?: string | null
  roleId?: string | null
  roleName?: string | null
  // Active subscription + plan for this user's branch (joined server-side).
  subscriptionId?: string | null
  subscriptionEndDate?: string | null
  planId?: string | null
  planName?: string | null
  planPrice?: string | null
  planCurrency?: string | null
  planBillingCycle?: string | null
}
