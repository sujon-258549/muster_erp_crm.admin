import { baseApi } from "@/redux/api/base-api"
import type { ApiResponse, PaginatedResponse } from "@/types/common"
import { toPaginated } from "@/redux/api/response-helpers"
import type {
  SubscriptionPlan,
  SubscriptionPlanListParams,
  SubscriptionPlanPayload,
} from "./types"

export const subscriptionPlansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listSubscriptionPlans: builder.query<
      PaginatedResponse<SubscriptionPlan>,
      SubscriptionPlanListParams | void
    >({
      query: (params) => ({
        url: "/subscription-plan",
        params: params ?? undefined,
      }),
      transformResponse: (raw: any) => toPaginated<SubscriptionPlan>(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "SubscriptionPlan" as const,
                id,
              })),
              { type: "SubscriptionPlan", id: "LIST" },
            ]
          : [{ type: "SubscriptionPlan", id: "LIST" }],
    }),

    getSubscriptionPlan: builder.query<ApiResponse<SubscriptionPlan>, string>({
      query: (id) => `/subscription-plan/${id}`,
      providesTags: (_r, _e, id) => [{ type: "SubscriptionPlan", id }],
    }),

    createSubscriptionPlan: builder.mutation<
      ApiResponse<SubscriptionPlan>,
      SubscriptionPlanPayload
    >({
      query: (body) => ({ url: "/subscription-plan", method: "POST", body }),
      invalidatesTags: [{ type: "SubscriptionPlan", id: "LIST" }],
    }),

    updateSubscriptionPlan: builder.mutation<
      ApiResponse<SubscriptionPlan>,
      { id: string; data: Partial<SubscriptionPlanPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/subscription-plan/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "SubscriptionPlan", id },
        { type: "SubscriptionPlan", id: "LIST" },
      ],
    }),

    deleteSubscriptionPlan: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({ url: `/subscription-plan/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "SubscriptionPlan", id: "LIST" }],
    }),

    toggleSubscriptionPlanStatus: builder.mutation<
      ApiResponse<SubscriptionPlan>,
      string
    >({
      query: (id) => ({
        url: `/subscription-plan/${id}/status`,
        method: "PATCH",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "SubscriptionPlan", id },
        { type: "SubscriptionPlan", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useListSubscriptionPlansQuery,
  useGetSubscriptionPlanQuery,
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
  useDeleteSubscriptionPlanMutation,
  useToggleSubscriptionPlanStatusMutation,
} = subscriptionPlansApi
