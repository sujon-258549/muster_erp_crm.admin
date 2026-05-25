import { baseApi } from "@/redux/api/base-api"
import { normalizeUser } from "@/lib/normalize-user"
import type { User } from "@/types/user"

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginResponse extends AuthTokens {
  user: User
}

export interface RefreshResponse {
  accessToken: string
  refreshToken?: string
}

// Backends often wrap success bodies in { success, message, data: {...} }.
// Unwrap that here so the rest of the app sees a flat { user, accessToken, refreshToken }.
const unwrap = <T>(raw: unknown): T => {
  if (raw && typeof raw === "object" && "data" in raw) {
    const inner = (raw as { data: unknown }).data
    if (inner && typeof inner === "object") return inner as T
  }
  return raw as T
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      transformResponse: (response: unknown): LoginResponse => {
        const flat = unwrap<Partial<LoginResponse> & Record<string, unknown>>(response)
        return {
          ...(flat as LoginResponse),
          user: normalizeUser(
            (flat.user as Parameters<typeof normalizeUser>[0]) ??
              (flat as unknown as Parameters<typeof normalizeUser>[0]),
          ),
        }
      },
      invalidatesTags: ["Auth"],
    }),
    refresh: builder.mutation<RefreshResponse, { refreshToken: string }>({
      query: (body) => ({ url: "/auth/refresh", method: "POST", body }),
      transformResponse: (response: unknown) => unwrap<RefreshResponse>(response),
    }),
    me: builder.query<User, void>({
      query: () => "/auth/me",
      transformResponse: (response: unknown) => unwrap<User>(response),
      providesTags: ["Auth"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: ["Auth"],
    }),
  }),
  overrideExisting: false,
})

export const {
  useLoginMutation,
  useRefreshMutation,
  useMeQuery,
  useLogoutMutation,
} = authApi
