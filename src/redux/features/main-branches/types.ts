// MainBranch domain types — mirrors the backend zod schema.

export interface MainBranch {
  id: string
  name: string | null
  description: string | null
  logo: string | null
  email: string | null
  phone: string | null
  website: string | null
  address: string | null
  division: string | null
  district: string | null
  upazila: string | null
  industry: string | null
  businessType: string | null
  registrationNo: string | null
  taxId: string | null
  currency: string | null
  timezone: string | null
  isActive: boolean
  isDeleted: boolean
  ownerId: string | null
  createdAt: string
  updatedAt: string
}

export interface MainBranchPayload {
  name: string
  description?: string
  logo?: string
  email?: string
  phone?: string
  website?: string
  address?: string
  division?: string
  district?: string
  upazila?: string
  industry?: string
  businessType?: string
  registrationNo?: string
  taxId?: string
  currency?: string
  timezone?: string
  isActive?: boolean
  ownerId?: string
}

export interface MainBranchListParams {
  page?: number
  limit?: number
  searchTerm?: string
}
