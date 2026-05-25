// Designation (job title) domain types.

export interface Designation {
  id: string
  name: string
  slug: string | null
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface DesignationPayload {
  name: string
  description?: string
  isActive?: boolean
}

export interface DesignationListParams {
  page?: number
  limit?: number
  searchTerm?: string
}
