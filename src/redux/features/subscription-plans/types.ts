// Subscription Plan — the master template you create once and reuse for
// every customer. A Subscription instance points at a plan and inherits
// its price/cycle by default, while still allowing per-customer overrides.

import type { BillingCycle } from "@/redux/features/subscriptions"

export interface SubscriptionPlan {
  id: string
  name: string | null
  description: string | null
  price: number | null
  currency: string | null
  billingCycle: BillingCycle | null
  // Number of months covered. 0 (or null) means "lifetime".
  durationMonths: number | null
  features: string[] | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface SubscriptionPlanPayload {
  name: string
  description?: string
  price: number
  currency: string
  billingCycle: BillingCycle
  durationMonths?: number | null
  features?: string[]
  isActive?: boolean
}

export interface SubscriptionPlanListParams {
  page?: number
  limit?: number
  searchTerm?: string
}
