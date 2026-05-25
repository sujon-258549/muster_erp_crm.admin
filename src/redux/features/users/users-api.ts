import { baseApi } from "@/redux/api/base-api"
import { normalizeUser } from "@/lib/normalize-user"
import { toPaginated } from "@/redux/api/response-helpers"
import type { ApiResponse, PaginatedResponse } from "@/types/common"
import type { User } from "@/types/user"
import type {
  ChangePasswordPayload,
  CreateEmployeePayload,
  EmployeeRow,
  ListUsersParams,
  UpdateUserPayload,
  VerifyOtpPayload,
} from "./types"

// Flatten the nested user-with-relations payload into the row shape the
// employee list table renders.
const flattenEmployee = (raw: any): EmployeeRow => {
  const u = normalizeUser(raw)
  return {
    ...u,
    mobile: raw?.mobile ?? null,
    isActive: raw?.isActive ?? true,
    isBlocked: raw?.isBlocked ?? false,
    isDeleted: raw?.isDeleted ?? false,
    departmentName: raw?.department?.name ?? null,
    designationName: raw?.designation?.name ?? null,
  }
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createEmployee: builder.mutation<ApiResponse<User>, CreateEmployeePayload>({
      query: (body) => ({
        url: "/users/create-employ",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    getAllUsers: builder.query<
      PaginatedResponse<EmployeeRow>,
      ListUsersParams | void
    >({
      query: (params) => ({ url: "/users", params: params ?? undefined }),
      transformResponse: (raw: any): PaginatedResponse<EmployeeRow> => {
        const flat = toPaginated<EmployeeRow>(raw)
        return { ...flat, data: (raw?.data ?? []).map(flattenEmployee) }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "User" as const, id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    getMyData: builder.query<ApiResponse<User>, void>({
      query: () => "/users/my-data",
      transformResponse: (raw: unknown): ApiResponse<User> => {
        const r = raw as { success?: boolean; message?: string; data?: unknown }
        return {
          success: r?.success ?? true,
          message: r?.message ?? "",
          data: normalizeUser(r?.data as Parameters<typeof normalizeUser>[0]),
        }
      },
      providesTags: [{ type: "User", id: "ME" }],
    }),

    getUserById: builder.query<ApiResponse<User>, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_r, _e, id) => [{ type: "User", id }],
    }),

    changePassword: builder.mutation<ApiResponse<null>, ChangePasswordPayload>({
      query: (body) => ({
        url: "/users/change-password",
        method: "PATCH",
        body,
      }),
    }),

    verifyOtp: builder.mutation<ApiResponse<{ token?: string }>, VerifyOtpPayload>({
      query: (body) => ({
        url: "/users/varify-otp",
        method: "POST",
        body,
      }),
    }),

    updateUser: builder.mutation<
      ApiResponse<User>,
      { id: string; data: UpdateUserPayload }
    >({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    deleteUser: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    softDeleteUser: builder.mutation<ApiResponse<User>, string>({
      query: (id) => ({
        url: `/users/${id}/soft-delete`,
        method: "PATCH",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),

    blockUser: builder.mutation<ApiResponse<User>, string>({
      query: (id) => ({ url: `/users/${id}/block`, method: "PATCH" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useCreateEmployeeMutation,
  useGetAllUsersQuery,
  useGetMyDataQuery,
  useGetUserByIdQuery,
  useChangePasswordMutation,
  useVerifyOtpMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useSoftDeleteUserMutation,
  useBlockUserMutation,
} = usersApi
