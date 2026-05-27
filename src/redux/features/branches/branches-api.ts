import { baseApi } from "@/redux/api/base-api"
import type { ApiResponse, PaginatedResponse } from "@/types/common"
import { toPaginated } from "@/redux/api/response-helpers"
import type { Branch, BranchListParams, BranchPayload } from "./types"

export const branchesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listBranches: builder.query<
      PaginatedResponse<Branch>,
      BranchListParams | void
    >({
      query: (params) => ({ url: "/branch", params: params ?? undefined }),
      transformResponse: (raw: any) => toPaginated<Branch>(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Branch" as const,
                id,
              })),
              { type: "Branch", id: "LIST" },
            ]
          : [{ type: "Branch", id: "LIST" }],
    }),

    getBranch: builder.query<ApiResponse<Branch>, string>({
      query: (id) => `/branch/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Branch", id }],
    }),

    createBranch: builder.mutation<ApiResponse<Branch>, BranchPayload>({
      query: (body) => ({ url: "/branch", method: "POST", body }),
      invalidatesTags: [{ type: "Branch", id: "LIST" }],
    }),

    updateBranch: builder.mutation<
      ApiResponse<Branch>,
      { id: string; data: Partial<BranchPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/branch/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Branch", id },
        { type: "Branch", id: "LIST" },
      ],
    }),

    deleteBranch: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({ url: `/branch/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Branch", id: "LIST" }],
    }),

    toggleBranchStatus: builder.mutation<ApiResponse<Branch>, string>({
      query: (id) => ({ url: `/branch/${id}/status`, method: "PATCH" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Branch", id },
        { type: "Branch", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useListBranchesQuery,
  useGetBranchQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  useToggleBranchStatusMutation,
} = branchesApi
