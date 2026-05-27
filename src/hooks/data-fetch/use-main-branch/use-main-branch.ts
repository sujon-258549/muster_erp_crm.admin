import {
  useCreateMainBranchMutation,
  useDeleteMainBranchMutation,
  useGetMainBranchQuery,
  useListMainBranchesQuery,
  useToggleMainBranchStatusMutation,
  useUpdateMainBranchMutation,
  type MainBranchListParams,
} from "@/redux/features/main-branches"

export const useMainBranch = (params?: MainBranchListParams) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useListMainBranchesQuery(params ?? {})

  const [createMainBranch, { isLoading: isCreating }] = useCreateMainBranchMutation()
  const [updateMainBranch, { isLoading: isUpdating }] = useUpdateMainBranchMutation()
  const [deleteMainBranch, { isLoading: isDeleting }] = useDeleteMainBranchMutation()
  const [toggleMainBranchStatus, { isLoading: isStatusUpdating }] =
    useToggleMainBranchStatusMutation()

  return {
    response,
    mainBranches: response?.data ?? [],
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
    createMainBranch,
    updateMainBranch,
    deleteMainBranch,
    toggleMainBranchStatus,
    useGetMainBranchById: useGetMainBranchQuery,
  }
}
