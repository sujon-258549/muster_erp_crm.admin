import {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useListRolesQuery,
  useGetRoleQuery,
  useUpdateRoleMutation,
  useToggleRoleStatusMutation,
  type RoleListParams,
} from "@/redux/features/roles"

// Single hook that pages call to get everything Role-related — list + meta
// + mutations + an aggregate `isLoading` flag. Lets pages stay short:
//
//   const { roles, isLoading, createRole, deleteRole } = useRole()
//
// Pass query params to scope the list:
//
//   const { roles } = useRole({ searchTerm: "admin", limit: 50 })
export const useRole = (params?: RoleListParams) => {
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useListRolesQuery(params ?? {})

  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation()
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation()
  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation()
  const [toggleRoleStatus, { isLoading: isStatusUpdating }] =
    useToggleRoleStatusMutation()

  return {
    response,
    roles: response?.data ?? [],
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
    createRole,
    updateRole,
    deleteRole,
    toggleRoleStatus,
    useGetRoleById: useGetRoleQuery,
  }
}
