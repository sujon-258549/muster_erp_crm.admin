import { baseApi } from "@/redux/api/base-api"
import type { PaginatedResponse } from "@/types/common"
import type { Customer } from "./types"

interface ListParams {
  page?: number
  perPage?: number
  search?: string
}

export const customersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listCustomers: builder.query<PaginatedResponse<Customer>, ListParams | void>({
      query: (params) => ({ url: "/customers", params: params ?? undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Customer" as const, id })),
              { type: "Customer", id: "LIST" },
            ]
          : [{ type: "Customer", id: "LIST" }],
    }),
    getCustomer: builder.query<Customer, string>({
      query: (id) => `/customers/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Customer", id }],
    }),
    createCustomer: builder.mutation<Customer, Partial<Customer>>({
      query: (body) => ({ url: "/customers", method: "POST", body }),
      invalidatesTags: [{ type: "Customer", id: "LIST" }],
    }),
    updateCustomer: builder.mutation<
      Customer,
      { id: string; data: Partial<Customer> }
    >({
      query: ({ id, data }) => ({
        url: `/customers/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Customer", id },
        { type: "Customer", id: "LIST" },
      ],
    }),
    deleteCustomer: builder.mutation<void, string>({
      query: (id) => ({ url: `/customers/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Customer", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
})

export const {
  useListCustomersQuery,
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customersApi
