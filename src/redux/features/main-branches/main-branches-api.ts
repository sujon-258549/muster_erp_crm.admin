import { baseApi } from "@/redux/api/base-api"
import type { ApiResponse, PaginatedResponse } from "@/types/common"
import { toPaginated } from "@/redux/api/response-helpers"
import type { MainBranch, MainBranchListParams, MainBranchPayload } from "./types"

export const mainBranchesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listMainBranches: builder.query<
      PaginatedResponse<MainBranch>,
      MainBranchListParams | void
    >({
      query: (params) => ({ url: "/main-branch", params: params ?? undefined }),
      transformResponse: (raw: any) => toPaginated<MainBranch>(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "MainBranch" as const,
                id,
              })),
              { type: "MainBranch", id: "LIST" },
            ]
          : [{ type: "MainBranch", id: "LIST" }],
    }),

    getMainBranch: builder.query<ApiResponse<MainBranch>, string>({
      query: (id) => `/main-branch/${id}`,
      providesTags: (_r, _e, id) => [{ type: "MainBranch", id }],
    }),

    createMainBranch: builder.mutation<ApiResponse<MainBranch>, MainBranchPayload>({
      query: (body) => ({ url: "/main-branch", method: "POST", body }),
      invalidatesTags: [{ type: "MainBranch", id: "LIST" }],
    }),

    updateMainBranch: builder.mutation<
      ApiResponse<MainBranch>,
      { id: string; data: Partial<MainBranchPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/main-branch/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "MainBranch", id },
        { type: "MainBranch", id: "LIST" },
      ],
    }),

    deleteMainBranch: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({ url: `/main-branch/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "MainBranch", id: "LIST" }],
    }),

    toggleMainBranchStatus: builder.mutation<ApiResponse<MainBranch>, string>({
      query: (id) => ({ url: `/main-branch/${id}/status`, method: "PATCH" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "MainBranch", id },
        { type: "MainBranch", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useListMainBranchesQuery,
  useGetMainBranchQuery,
  useCreateMainBranchMutation,
  useUpdateMainBranchMutation,
  useDeleteMainBranchMutation,
  useToggleMainBranchStatusMutation,
} = mainBranchesApi
