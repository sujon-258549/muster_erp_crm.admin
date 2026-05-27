import {
  useCreateSubscriptionPlanMutation,
  useDeleteSubscriptionPlanMutation,
  useGetSubscriptionPlanQuery,
  useListSubscriptionPlansQuery,
  useToggleSubscriptionPlanStatusMutation,
  useUpdateSubscriptionPlanMutation,
  type SubscriptionPlanListParams,
} from "@/redux/features/subscription-plans"

export const useSubscriptionPlan = (params?: SubscriptionPlanListParams) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useListSubscriptionPlansQuery(params ?? {})

  const [createPlan, { isLoading: isCreating }] =
    useCreateSubscriptionPlanMutation()
  const [updatePlan, { isLoading: isUpdating }] =
    useUpdateSubscriptionPlanMutation()
  const [deletePlan, { isLoading: isDeleting }] =
    useDeleteSubscriptionPlanMutation()
  const [togglePlanStatus, { isLoading: isStatusUpdating }] =
    useToggleSubscriptionPlanStatusMutation()

  return {
    response,
    plans: response?.data ?? [],
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
    createPlan,
    updatePlan,
    deletePlan,
    togglePlanStatus,
    useGetPlanById: useGetSubscriptionPlanQuery,
  }
}
