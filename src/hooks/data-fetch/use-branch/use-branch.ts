import {
  useCreateBranchMutation,
  useDeleteBranchMutation,
  useGetBranchQuery,
  useListBranchesQuery,
  useToggleBranchStatusMutation,
  useUpdateBranchMutation,
  type BranchListParams,
} from "@/redux/features/branches"

export const useBranch = (params?: BranchListParams) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useListBranchesQuery(params ?? {})

  const [createBranch, { isLoading: isCreating }] = useCreateBranchMutation()
  const [updateBranch, { isLoading: isUpdating }] = useUpdateBranchMutation()
  const [deleteBranch, { isLoading: isDeleting }] = useDeleteBranchMutation()
  const [toggleBranchStatus, { isLoading: isStatusUpdating }] =
    useToggleBranchStatusMutation()

  return {
    response,
    branches: response?.data ?? [],
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
    createBranch,
    updateBranch,
    deleteBranch,
    toggleBranchStatus,
    useGetBranchById: useGetBranchQuery,
  }
}
