import {
  useCreateDepartmentMutation,
  useDeleteDepartmentMutation,
  useListDepartmentsQuery,
  useGetDepartmentQuery,
  useUpdateDepartmentMutation,
  useToggleDepartmentStatusMutation,
  type DepartmentListParams,
} from "@/redux/features/departments"

// Mirror of useRole — see that file for the rationale. Use this in any
// page that needs the department list, mutations, or pagination meta.
export const useDepartment = (params?: DepartmentListParams) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useListDepartmentsQuery(params ?? {})

  const [createDepartment, { isLoading: isCreating }] =
    useCreateDepartmentMutation()
  const [updateDepartment, { isLoading: isUpdating }] =
    useUpdateDepartmentMutation()
  const [deleteDepartment, { isLoading: isDeleting }] =
    useDeleteDepartmentMutation()
  const [toggleDepartmentStatus, { isLoading: isStatusUpdating }] =
    useToggleDepartmentStatusMutation()

  return {
    response,
    departments: response?.data ?? [],
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
    createDepartment,
    updateDepartment,
    deleteDepartment,
    toggleDepartmentStatus,
    useGetDepartmentById: useGetDepartmentQuery,
  }
}
