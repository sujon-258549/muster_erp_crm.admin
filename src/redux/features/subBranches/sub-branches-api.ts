import { baseApi } from "@/redux/api/base-api"
import type { ApiResponse, PaginatedResponse } from "@/types/common"
import { toPaginated } from "@/redux/api/response-helpers"
import type {
  SubBranch,
  SubBranchListParams,
  SubBranchPayload,
} from "./types"

export const subBranchesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listSubBranches: builder.query<
      PaginatedResponse<SubBranch>,
      SubBranchListParams | void
    >({
      query: (params) => ({ url: "/sub-branch", params: params ?? undefined }),
      transformResponse: (raw: any) => toPaginated<SubBranch>(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "SubBranch" as const,
                id,
              })),
              { type: "SubBranch", id: "LIST" },
            ]
          : [{ type: "SubBranch", id: "LIST" }],
    }),

    getSubBranch: builder.query<ApiResponse<SubBranch>, string>({
      query: (id) => `/sub-branch/${id}`,
      providesTags: (_r, _e, id) => [{ type: "SubBranch", id }],
    }),

    createSubBranch: builder.mutation<ApiResponse<SubBranch>, SubBranchPayload>({
      query: (body) => ({ url: "/sub-branch", method: "POST", body }),
      invalidatesTags: [{ type: "SubBranch", id: "LIST" }],
    }),

    updateSubBranch: builder.mutation<
      ApiResponse<SubBranch>,
      { id: string; data: Partial<SubBranchPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/sub-branch/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "SubBranch", id },
        { type: "SubBranch", id: "LIST" },
      ],
    }),

    deleteSubBranch: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({ url: `/sub-branch/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "SubBranch", id: "LIST" }],
    }),

    toggleSubBranchStatus: builder.mutation<ApiResponse<SubBranch>, string>({
      query: (id) => ({ url: `/sub-branch/${id}/status`, method: "PATCH" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "SubBranch", id },
        { type: "SubBranch", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useListSubBranchesQuery,
  useGetSubBranchQuery,
  useCreateSubBranchMutation,
  useUpdateSubBranchMutation,
  useDeleteSubBranchMutation,
  useToggleSubBranchStatusMutation,
} = subBranchesApi
