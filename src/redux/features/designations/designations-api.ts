import { baseApi } from "@/redux/api/base-api"
import type { ApiResponse, PaginatedResponse } from "@/types/common"
import { toPaginated } from "@/redux/api/response-helpers"
import type {
  Designation,
  DesignationListParams,
  DesignationPayload,
} from "./types"

export const designationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listDesignations: builder.query<
      PaginatedResponse<Designation>,
      DesignationListParams | void
    >({
      query: (params) => ({ url: "/designation", params: params ?? undefined }),
      transformResponse: (raw: any) => toPaginated<Designation>(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Designation" as const,
                id,
              })),
              { type: "Designation", id: "LIST" },
            ]
          : [{ type: "Designation", id: "LIST" }],
    }),

    getDesignation: builder.query<ApiResponse<Designation>, string>({
      query: (id) => `/designation/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Designation", id }],
    }),

    createDesignation: builder.mutation<
      ApiResponse<Designation>,
      DesignationPayload
    >({
      query: (body) => ({ url: "/designation", method: "POST", body }),
      invalidatesTags: [{ type: "Designation", id: "LIST" }],
    }),

    updateDesignation: builder.mutation<
      ApiResponse<Designation>,
      { id: string; data: Partial<DesignationPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/designation/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Designation", id },
        { type: "Designation", id: "LIST" },
      ],
    }),

    deleteDesignation: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({ url: `/designation/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Designation", id: "LIST" }],
    }),

    toggleDesignationStatus: builder.mutation<ApiResponse<Designation>, string>({
      query: (id) => ({ url: `/designation/${id}/status`, method: "PATCH" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Designation", id },
        { type: "Designation", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useListDesignationsQuery,
  useGetDesignationQuery,
  useCreateDesignationMutation,
  useUpdateDesignationMutation,
  useDeleteDesignationMutation,
  useToggleDesignationStatusMutation,
} = designationsApi
