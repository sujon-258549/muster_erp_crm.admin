// Subscription domain types — a sale of a Plan to a customer company
// (= MainBranch). Pure instance: all plan-detail fields (name, price,
// cycle, currency) come from the linked SubscriptionPlan and are
// rendered via the nested `plan` relation, never duplicated here.

import type { MainBranch } from "@/redux/features/main-branches"
import type { SubscriptionPlan } from "@/redux/features/subscription-plans"

// Stable identifier for a billing period — one of the entries listed in
// `lib/billing-cycles.ts` (e.g. "7-day", "2-week", "3-month", "1-year",
// "lifetime"). Kept as `string` so the option catalog stays flexible.
export type BillingCycle = string

export interface Subscription {
  id: string
  branchId: string | null
  branchName?: string | null
  planId: string | null
  // Backend includes the nested plan + branch on list/detail responses.
  plan?: SubscriptionPlan | null
  branch?: MainBranch | null
  startDate: string | null
  // Null when the linked plan is lifetime.
  endDate: string | null
  notes: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface SubscriptionPayload {
  branchId: string
  planId: string
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
