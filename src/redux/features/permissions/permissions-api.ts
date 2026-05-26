import { baseApi } from "@/redux/api/base-api"
import type { ApiResponse, PaginatedResponse } from "@/types/common"
import { toPaginated } from "@/redux/api/response-helpers"
import type {
  RolePermission,
  RolePermissionListParams,
  RolePermissionPayload,
} from "./types"

// Tag id used to invalidate every list view (the cross-role table and any
// per-role lookup) after a write.
const LIST_TAG = { type: "Permission", id: "LIST" } as const

export const permissionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listPermissions: builder.query<
      PaginatedResponse<RolePermission>,
      RolePermissionListParams | void
    >({
      query: (params) => ({ url: "/permission", params: params ?? undefined }),
      transformResponse: (raw: any) => toPaginated<RolePermission>(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Permission" as const,
                id,
              })),
              LIST_TAG,
            ]
          : [LIST_TAG],
    }),

    getPermissionsByRole: builder.query<ApiResponse<RolePermission[]>, string>({
      query: (roleId) => `/permission/role/${roleId}`,
      providesTags: (_r, _e, roleId) => [
        { type: "Permission", id: `role:${roleId}` },
        LIST_TAG,
      ],
    }),

    createPermission: builder.mutation<
      ApiResponse<RolePermission>,
      RolePermissionPayload
    >({
      query: (body) => ({ url: "/permission", method: "POST", body }),
      invalidatesTags: (_r, _e, { roleId }) => [
        LIST_TAG,
        { type: "Permission", id: `role:${roleId}` },
      ],
    }),

    updatePermission: builder.mutation<
      ApiResponse<RolePermission>,
      { id: string; data: Partial<RolePermissionPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/permission/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id, data }) => [
        { type: "Permission", id },
        LIST_TAG,
        ...(data.roleId
          ? [{ type: "Permission" as const, id: `role:${data.roleId}` }]
          : []),
      ],
    }),

    deletePermission: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({ url: `/permission/${id}`, method: "DELETE" }),
      invalidatesTags: [LIST_TAG],
    }),

    // Atomic bulk-sync of a role's full permission map. Backend does
    // upsert + delete inside a single transaction.
    replaceRolePermissions: builder.mutation<
      ApiResponse<RolePermission[]>,
      { roleId: string; permissions: { module: string; permissions: string[] }[] }
    >({
      query: ({ roleId, permissions }) => ({
        url: `/permission/role/${roleId}`,
        method: "PUT",
        body: { permissions },
      }),
      invalidatesTags: (_r, _e, { roleId }) => [
        LIST_TAG,
        { type: "Permission", id: `role:${roleId}` },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useListPermissionsQuery,
  useGetPermissionsByRoleQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
  useReplaceRolePermissionsMutation,
} = permissionsApi
