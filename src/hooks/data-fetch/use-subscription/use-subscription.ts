import {
  useCreateSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useGetSubscriptionQuery,
  useListSubscriptionsQuery,
  useToggleSubscriptionStatusMutation,
  useUpdateSubscriptionMutation,
  type SubscriptionListParams,
} from "@/redux/features/subscriptions"

export const useSubscription = (params?: SubscriptionListParams) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useListSubscriptionsQuery(params ?? {})

  const [createSubscription, { isLoading: isCreating }] =
    useCreateSubscriptionMutation()
  const [updateSubscription, { isLoading: isUpdating }] =
    useUpdateSubscriptionMutation()
  const [deleteSubscription, { isLoading: isDeleting }] =
    useDeleteSubscriptionMutation()
  const [toggleSubscriptionStatus, { isLoading: isStatusUpdating }] =
    useToggleSubscriptionStatusMutation()

  return {
    response,
    subscriptions: response?.data ?? [],
    meta: response?.meta,
    isLoading:
      isLoading ||
      isFetching ||
      isCreating ||
      isUpdating ||
      isDeleting ||
      isStatusUpdating,
    isFetching,
    refetch,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    toggleSubscriptionStatus,
    useGetSubscriptionById: useGetSubscriptionQuery,
  }
}
