// Role domain types.

export interface Role {
  id: string
  role: string | null
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface RolePayload {
  role: string
  description?: string
  isActive?: boolean
}

export interface RoleListParams {
  page?: number
  limit?: number
  searchTerm?: string
}
