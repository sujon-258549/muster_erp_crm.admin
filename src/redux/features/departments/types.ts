// Department domain types — shared between the API layer and pages.

export interface Department {
  id: string
  name: string | null
  description: string | null
  isActive: boolean
  branchId: string | null
  createdAt: string
  updatedAt: string
}

export interface DepartmentPayload {
  name: string
  description?: string
  isActive?: boolean
}

export interface DepartmentListParams {
  page?: number
  limit?: number
  searchTerm?: string
}
