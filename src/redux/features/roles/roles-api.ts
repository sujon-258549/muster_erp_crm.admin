import { baseApi } from "@/redux/api/base-api"
import type { ApiResponse, PaginatedResponse } from "@/types/common"
import { toPaginated } from "@/redux/api/response-helpers"
import type { Role, RoleListParams, RolePayload } from "./types"

export const rolesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listRoles: builder.query<PaginatedResponse<Role>, RoleListParams | void>({
      query: (params) => ({ url: "/role", params: params ?? undefined }),
      transformResponse: (raw: any) => toPaginated<Role>(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Role" as const, id })),
              { type: "Role", id: "LIST" },
            ]
          : [{ type: "Role", id: "LIST" }],
    }),

    getRole: builder.query<ApiResponse<Role>, string>({
      query: (id) => `/role/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Role", id }],
    }),

    createRole: builder.mutation<ApiResponse<Role>, RolePayload>({
      query: (body) => ({ url: "/role", method: "POST", body }),
      invalidatesTags: [{ type: "Role", id: "LIST" }],
    }),

    updateRole: builder.mutation<
      ApiResponse<Role>,
      { id: string; data: Partial<RolePayload> }
    >({
      query: ({ id, data }) => ({
        url: `/role/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Role", id },
        { type: "Role", id: "LIST" },
      ],
    }),

    deleteRole: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({ url: `/role/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Role", id: "LIST" }],
    }),

    toggleRoleStatus: builder.mutation<ApiResponse<Role>, string>({
      query: (id) => ({ url: `/role/${id}/status`, method: "PATCH" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Role", id },
        { type: "Role", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useListRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useToggleRoleStatusMutation,
} = rolesApi
