import {
  useCreatePermissionMutation,
  useDeletePermissionMutation,
  useGetPermissionsByRoleQuery,
  useListPermissionsQuery,
  useReplaceRolePermissionsMutation,
  useUpdatePermissionMutation,
  type RolePermissionListParams,
} from "@/redux/features/permissions"

// Encapsulates the role-permission table API. Pass `roleId` to lazy-load
// per-role permissions for the permission modal.
export const useRolePermission = (
  params?: RolePermissionListParams & { roleId?: string },
) => {
  const {
    data: listRes,
    isLoading,
    isFetching,
    refetch,
  } = useListPermissionsQuery(params ?? {})

  const perRole = useGetPermissionsByRoleQuery(params?.roleId ?? "", {
    skip: !params?.roleId,
  })

  const [createPermission, { isLoading: isCreating }] =
    useCreatePermissionMutation()
  const [updatePermission, { isLoading: isUpdating }] =
    useUpdatePermissionMutation()
  const [deletePermission, { isLoading: isDeleting }] =
    useDeletePermissionMutation()
  const [replaceRolePermissions, { isLoading: isReplacing }] =
    useReplaceRolePermissionsMutation()

  return {
    response: listRes,
    permissions: listRes?.data ?? [],
    meta: listRes?.meta,
    rolePermissions: perRole.data?.data ?? [],
    isRolePermissionLoading: perRole.isLoading || perRole.isFetching,
    isLoading:
      isLoading ||
      isFetching ||
      isCreating ||
      isUpdating ||
      isDeleting ||
      isReplacing,
    isFetching,
    refetch,
    createPermission,
    updatePermission,
    deletePermission,
    replaceRolePermissions,
  }
}
