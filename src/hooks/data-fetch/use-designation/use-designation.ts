import {
  useCreateDesignationMutation,
  useDeleteDesignationMutation,
  useListDesignationsQuery,
  useGetDesignationQuery,
  useUpdateDesignationMutation,
  useToggleDesignationStatusMutation,
  type DesignationListParams,
} from "@/redux/features/designations"

// Designations (job titles) — full CRUD bundled into one hook.
export const useDesignation = (params?: DesignationListParams) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useListDesignationsQuery(params ?? {})

  const [createDesignation, { isLoading: isCreating }] =
    useCreateDesignationMutation()
  const [updateDesignation, { isLoading: isUpdating }] =
    useUpdateDesignationMutation()
  const [deleteDesignation, { isLoading: isDeleting }] =
    useDeleteDesignationMutation()
  const [toggleDesignationStatus, { isLoading: isStatusUpdating }] =
    useToggleDesignationStatusMutation()

  return {
    response,
    designations: response?.data ?? [],
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
    createDesignation,
    updateDesignation,
    deleteDesignation,
    toggleDesignationStatus,
    useGetDesignationById: useGetDesignationQuery,
  }
}
