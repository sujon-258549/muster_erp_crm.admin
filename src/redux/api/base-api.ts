import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react"
import { env } from "@/config/env"
import {
  loggedOut,
  tokensRefreshed,
} from "@/redux/features/auth/auth-slice"
import type { RootState } from "@/redux/store"

interface RefreshSuccess {
  accessToken: string
  refreshToken?: string
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken
    if (token) headers.set("Authorization", `Bearer ${token}`)
    headers.set("Accept", "application/json")
    return headers
  },
})

// Module-scoped single-flight gate — multiple parallel 401s coalesce into a
// single /auth/refresh call.
let refreshPromise: Promise<RefreshSuccess | null> | null = null

const performRefresh = async (
  refreshToken: string,
  api: Parameters<BaseQueryFn>[1],
): Promise<RefreshSuccess | null> => {
  const result = await rawBaseQuery(
    {
      url: "/auth/refresh",
      method: "POST",
      body: { refreshToken },
    },
    api,
    {},
  )

  if (result.error || !result.data) return null
  const raw = result.data as { data?: RefreshSuccess } & RefreshSuccess
  // Unwrap if backend wrapped it as { success, data: { accessToken, ... } }
  return (raw.data && typeof raw.data === "object" ? raw.data : raw) ?? null
}

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error?.status !== 401) return result

  // Skip refresh dance for the refresh endpoint itself or for login —
  // we don't want a refresh loop or a logout on a wrong-credentials response.
  const url = typeof args === "string" ? args : args.url
  if (url.includes("/auth/refresh") || url.includes("/auth/login")) {
    return result
  }

  const state = api.getState() as RootState
  const currentRefreshToken = state.auth.refreshToken

  if (!currentRefreshToken) {
    // No refresh token to use. Don't auto-logout — likely a setup issue
    // (e.g. login response shape mismatched, token never persisted). Surface
    // the 401 so the caller / UI can show a real error.
    if (import.meta.env.DEV) {
      console.warn(
        "[base-api] 401 on",
        url,
        "but no refreshToken in state. Skipping auto-logout — check that the login response actually contained refreshToken.",
      )
    }
    return result
  }

  if (!refreshPromise) {
    refreshPromise = performRefresh(currentRefreshToken, api).finally(() => {
      refreshPromise = null
    })
  }

  const refreshed = await refreshPromise

  if (!refreshed?.accessToken) {
    if (import.meta.env.DEV) {
      console.warn("[base-api] /auth/refresh failed — logging user out.")
    }
    api.dispatch(loggedOut())
    // Drop every cached query so the login page isn't seeded with the
    // previous user's data.
    api.dispatch(baseApi.util.resetApiState())
    return result
  }

  api.dispatch(
    tokensRefreshed({
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken,
    }),
  )

  // Retry original request with the new token.
  result = await rawBaseQuery(args, api, extraOptions)
  return result
}

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "User",
    "Customer",
    "Product",
    "Order",
    "Invoice",
    "Department",
    "Role",
    "Designation",
    "Permission",
    "MainBranch",
    "SubBranch",
    "Subscription",
    "SubscriptionPlan",
  ],
  endpoints: () => ({}),
})
