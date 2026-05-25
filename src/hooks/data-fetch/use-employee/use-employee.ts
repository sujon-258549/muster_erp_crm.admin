import {
  useBlockUserMutation,
  useCreateEmployeeMutation,
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useSoftDeleteUserMutation,
  useUpdateUserMutation,
  type ListUsersParams,
} from "@/redux/features/users"

// Aggregates all employee-related queries + mutations behind one hook so
// pages don't have to wire 6+ separate RTK hooks. `isLoading` is true while
// any of those operations is in flight.
export const useEmployee = (params?: ListUsersParams) => {
  const {
    data: response,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetAllUsersQuery(params ?? {})

  const [createEmployee, { isLoading: isCreating }] =
    useCreateEmployeeMutation()
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateUserMutation()
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteUserMutation()
  const [softDeleteEmployee, { isLoading: isSoftDeleting }] =
    useSoftDeleteUserMutation()
  const [blockEmployee, { isLoading: isBlocking }] = useBlockUserMutation()

  return {
    response,
    employees: response?.data ?? [],
    meta: response?.meta,
    error,
    isLoading:
      isLoading ||
      isFetching ||
      isCreating ||
      isUpdating ||
      isDeleting ||
      isSoftDeleting ||
      isBlocking,
    isFetching,
    refetch,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    softDeleteEmployee,
    blockEmployee,
    useGetEmployeeById: useGetUserByIdQuery,
  }
}
