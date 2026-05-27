import {
  useCreateSubBranchMutation,
  useDeleteSubBranchMutation,
  useGetSubBranchQuery,
  useListSubBranchesQuery,
  useToggleSubBranchStatusMutation,
  useUpdateSubBranchMutation,
  type SubBranchListParams,
} from "@/redux/features/subBranches"

export const useSubBranch = (params?: SubBranchListParams) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useListSubBranchesQuery(params ?? {})

  const [createSubBranch, { isLoading: isCreating }] =
    useCreateSubBranchMutation()
  const [updateSubBranch, { isLoading: isUpdating }] =
    useUpdateSubBranchMutation()
  const [deleteSubBranch, { isLoading: isDeleting }] =
    useDeleteSubBranchMutation()
  const [toggleSubBranchStatus, { isLoading: isStatusUpdating }] =
    useToggleSubBranchStatusMutation()

  return {
    response,
    subBranches: response?.data ?? [],
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
    createSubBranch,
    updateSubBranch,
    deleteSubBranch,
    toggleSubBranchStatus,
    useGetSubBranchById: useGetSubBranchQuery,
  }
}
