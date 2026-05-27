import { baseApi } from "@/redux/api/base-api"
import type { ApiResponse, PaginatedResponse } from "@/types/common"
import { toPaginated } from "@/redux/api/response-helpers"
import type {
  Subscription,
  SubscriptionListParams,
  SubscriptionPayload,
} from "./types"

export const subscriptionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listSubscriptions: builder.query<
      PaginatedResponse<Subscription>,
      SubscriptionListParams | void
    >({
      query: (params) => ({ url: "/subscription", params: params ?? undefined }),
      transformResponse: (raw: any) => toPaginated<Subscription>(raw),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Subscription" as const,
                id,
              })),
              { type: "Subscription", id: "LIST" },
            ]
          : [{ type: "Subscription", id: "LIST" }],
    }),

    getSubscription: builder.query<ApiResponse<Subscription>, string>({
      query: (id) => `/subscription/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Subscription", id }],
    }),

    createSubscription: builder.mutation<
      ApiResponse<Subscription>,
      SubscriptionPayload
    >({
      query: (body) => ({ url: "/subscription", method: "POST", body }),
      invalidatesTags: [{ type: "Subscription", id: "LIST" }],
    }),

    updateSubscription: builder.mutation<
      ApiResponse<Subscription>,
      { id: string; data: Partial<SubscriptionPayload> }
    >({
      query: ({ id, data }) => ({
        url: `/subscription/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Subscription", id },
        { type: "Subscription", id: "LIST" },
      ],
    }),

    deleteSubscription: builder.mutation<ApiResponse<unknown>, string>({
      query: (id) => ({ url: `/subscription/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Subscription", id: "LIST" }],
    }),

    toggleSubscriptionStatus: builder.mutation<
      ApiResponse<Subscription>,
      string
    >({
      query: (id) => ({ url: `/subscription/${id}/status`, method: "PATCH" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "Subscription", id },
        { type: "Subscription", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
})

export const {
  useListSubscriptionsQuery,
  useGetSubscriptionQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useToggleSubscriptionStatusMutation,
} = subscriptionsApi
