// Subscription domain types — represents a plan sold to a customer
// company (= Branch). The branch is the tenant; the subscription gates
// their access window.

export type BillingCycle =
  | "monthly"
  | "quarterly"
  | "half-yearly"
  | "yearly"
  | "lifetime"

export interface Subscription {
  id: string
  branchId: string | null
  branchName?: string | null
  planId: string | null
  planName: string | null
  price: number | null
  currency: string | null
  billingCycle: BillingCycle | null
  startDate: string | null
  // Null when billingCycle === "lifetime".
  endDate: string | null
  notes: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface SubscriptionPayload {
  branchId: string
  planId?: string
  planName: string
  price: number
  currency: string
  billingCycle: BillingCycle
  startDate: string
  endDate?: string | null
  notes?: string
  isActive?: boolean
}

export interface SubscriptionListParams {
  page?: number
  limit?: number
  searchTerm?: string
  branchId?: string
}
