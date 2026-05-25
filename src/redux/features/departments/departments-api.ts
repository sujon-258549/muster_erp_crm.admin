import { baseApi } from "@/redux/api/base-api"
import type { ApiResponse, PaginatedResponse } from "@/types/common"
import { toPaginated } from "@/redux/api/response-helpers"
import type {
  Department,
  DepartmentListParams,
  DepartmentPayload,
} from "./types"

export const departmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listDepartments: builder.query<
      PaginatedResponse<Department>,
      DepartmentListParams | void
    >({
      query: (params) => ({ url: "/department", params: params ?? undefined }),
      transformResponse: (raw: any) => toPaginated<Department>(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Department" as const,
                id,
              })),
              { type: "Department", id: "LIST" },
            ]
          : [{ type: "Department", id: "LIST" }],
    }),

    getDepartment: builder.query<ApiResponse<Department>, string>({
      query: (id) => `/department/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Department", id }],
    }),

    createDepartment: builder.mutation<ApiResponse<Department>, DepartmentPayload>({
      query: (body) => ({ url: "/department", method: "POST", body }),
      invalidatesTags: [{ type: "Department", id: "LIST" }],
    }),

    updateDepartment: builder.mutation<
      ApiResponse<Department>,
      { id: string; data: Partial<DepartmentPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/department/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Department", id },
        { type: "Department", id: "LIST" },
      ],
    }),

    deleteDepartment: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({ url: `/department/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Department", id: "LIST" }],
    }),

    toggleDepartmentStatus: builder.mutation<ApiResponse<Department>, string>({
      query: (id) => ({ url: `/department/${id}/status`, method: "PATCH" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Department", id },
        { type: "Department", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useListDepartmentsQuery,
  useGetDepartmentQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useToggleDepartmentStatusMutation,
} = departmentsApi
