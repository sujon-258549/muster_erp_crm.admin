// SubBranch domain types — mirrors the backend zod schema.

export interface SubBranch {
  id: string
  branchId: string | null
  name: string | null
  description: string | null
  email: string | null
  phone: string | null
  address: string | null
  division: string | null
  district: string | null
  upazila: string | null
  managerId: string | null
  isActive: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  branch?: { id: string; name: string | null } | null
}

export interface SubBranchPayload {
  branchId: string
  name: string
  description?: string
  email?: string
  phone?: string
  address?: string
  division?: string
  district?: string
  upazila?: string
  managerId?: string
  isActive?: boolean
}

export interface SubBranchListParams {
  page?: number
  limit?: number
  searchTerm?: string
  branchId?: string
}
