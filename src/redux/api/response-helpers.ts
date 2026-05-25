import type { PaginatedResponse } from "@/types/common"

interface RawPaginated {
  data?: unknown[]
  meta?: {
    page?: number
    limit?: number
    perPage?: number
    total?: number
  }
}

// The backend returns `{ data, meta: { page, limit, total } }` while the rest
// of the app speaks `{ data, meta: { page, perPage, total, totalPages } }`.
// Normalize once so every feature API can pipe its raw response through this.
export function toPaginated<T>(raw: RawPaginated | null | undefined): PaginatedResponse<T> {
  const data = (raw?.data ?? []) as T[]
  const perPage = raw?.meta?.limit ?? raw?.meta?.perPage ?? 10
  const total = raw?.meta?.total ?? 0
  const safePerPage = perPage || 10

  return {
    data,
    meta: {
      page: raw?.meta?.page ?? 1,
      perPage: safePerPage,
      total,
      totalPages: Math.max(1, Math.ceil(total / safePerPage)),
    },
  }
}
