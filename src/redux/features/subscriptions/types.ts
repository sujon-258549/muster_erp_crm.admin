// Subscription domain types — represents a plan sold to a customer
// company (= Branch). The branch is the tenant; the subscription gates
// their access window.

// Stable identifier for a billing period — one of the entries listed in
// `lib/billing-cycles.ts` (e.g. "7-day", "2-week", "3-month", "1-year",
// "lifetime"). Kept as `string` so the option catalog stays flexible.
export type BillingCycle = string

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
