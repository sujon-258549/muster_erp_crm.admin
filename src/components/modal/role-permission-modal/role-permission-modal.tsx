import { useMemo, useState } from "react"
import { Loader2, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MODULES } from "@/config/modules"
import {
  PERMISSION_ACTIONS,
  type PermissionAction,
  type RolePermission,
} from "@/redux/features/permissions"
import { useRolePermission } from "@/hooks/data-fetch"
import type { Role } from "@/redux/features/roles"
import { getErrorMessage } from "@/lib/errors"

interface RolePermissionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
}

export function RolePermissionModal({
  open,
  onOpenChange,
  role,
}: RolePermissionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden sm:max-w-2xl">
        {role && (
          <RolePermissionEditor
            key={role.id}
            role={role}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

type Grid = Record<string, Set<PermissionAction>>

function buildGrid(rows: RolePermission[] | undefined): Grid {
  const grid: Grid = {}
  if (!rows) return grid
  for (const row of rows) {
    if (!row.module) continue
    const set = new Set<PermissionAction>()
    for (const p of row.permissions ?? []) {
      if (p === "create" || p === "read" || p === "update" || p === "delete")
        set.add(p)
    }
    grid[row.module] = set
  }
  return grid
}

function RolePermissionEditor({
  role,
  onClose,
}: {
  role: Role
  onClose: () => void
}) {
  const {
    rolePermissions,
    isRolePermissionLoading,
    createPermission,
    updatePermission,
    deletePermission,
  } = useRolePermission({ roleId: role.id })

  const existingByModule = useMemo(() => {
    const m = new Map<string, RolePermission>()
    for (const row of rolePermissions) {
      if (row.module) m.set(row.module, row)
    }
    return m
  }, [rolePermissions])

  // The grid is hydrated lazily from the server response the first time it
  // arrives, then becomes the source of truth for user edits.
  const [grid, setGrid] = useState<Grid | null>(null)
  const [saving, setSaving] = useState(false)
  const effectiveGrid = grid ?? buildGrid(rolePermissions)

  const toggle = (moduleKey: string, action: PermissionAction) => {
    setGrid((prev) => {
      const next: Grid = { ...(prev ?? buildGrid(rolePermissions)) }
      const set = new Set(next[moduleKey] ?? [])
      if (set.has(action)) set.delete(action)
      else set.add(action)
      next[moduleKey] = set
      return next
    })
  }

  const toggleAllForModule = (moduleKey: string) => {
    setGrid((prev) => {
      const base = prev ?? buildGrid(rolePermissions)
      const current = base[moduleKey] ?? new Set<PermissionAction>()
      const allChecked = PERMISSION_ACTIONS.every((a) => current.has(a))
      const next: Grid = { ...base }
      next[moduleKey] = allChecked
        ? new Set()
        : new Set<PermissionAction>(PERMISSION_ACTIONS)
      return next
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const tasks: Promise<unknown>[] = []
      for (const mod of MODULES) {
        const nextActions = Array.from(effectiveGrid[mod.key] ?? [])
        const existingRow = existingByModule.get(mod.key)
        if (existingRow) {
          if (nextActions.length === 0) {
            tasks.push(deletePermission(existingRow.id).unwrap())
          } else {
            tasks.push(
              updatePermission({
                id: existingRow.id,
                data: {
                  roleId: role.id,
                  module: mod.key,
                  permissions: nextActions,
                },
              }).unwrap(),
            )
          }
        } else if (nextActions.length > 0) {
          tasks.push(
            createPermission({
              roleId: role.id,
              module: mod.key,
              permissions: nextActions,
            }).unwrap(),
          )
        }
      }
      await Promise.all(tasks)
      toast.success("Permissions updated")
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save permissions"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary" />
          Permissions — {role.role ?? "—"}
        </DialogTitle>
        <DialogDescription>
          Choose which modules this role can access and what actions it can
          perform on each.
        </DialogDescription>
      </DialogHeader>

      <div className="my-4 max-h-[55vh] overflow-y-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Module</th>
              {PERMISSION_ACTIONS.map((a) => (
                <th key={a} className="px-3 py-2 text-center font-medium">
                  {a}
                </th>
              ))}
              <th className="px-3 py-2 text-center font-medium">All</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isRolePermissionLoading && rolePermissions.length === 0 ? (
              <tr>
                <td colSpan={PERMISSION_ACTIONS.length + 2}>
                  <div className="flex justify-center py-8 text-muted-foreground">
                    <Loader2 className="size-5 animate-spin" />
                  </div>
                </td>
              </tr>
            ) : (
              MODULES.map((mod) => {
                const set = effectiveGrid[mod.key] ?? new Set<PermissionAction>()
                const allChecked = PERMISSION_ACTIONS.every((a) => set.has(a))
                return (
                  <tr key={mod.key} className="hover:bg-accent/30">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <mod.icon className="size-4 text-muted-foreground" />
                        <span className="font-medium">{mod.label}</span>
                        {set.size > 0 && (
                          <Badge variant="secondary" className="text-[10px]">
                            {set.size}/{PERMISSION_ACTIONS.length}
                          </Badge>
                        )}
                      </div>
                    </td>
                    {PERMISSION_ACTIONS.map((a) => (
                      <td key={a} className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          className="size-4 cursor-pointer accent-primary"
                          checked={set.has(a)}
                          onChange={() => toggle(mod.key, a)}
                          aria-label={`${mod.label} ${a}`}
                        />
                      </td>
                    ))}
                    <td className="px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        className="size-4 cursor-pointer accent-primary"
                        checked={allChecked}
                        onChange={() => toggleAllForModule(mod.key)}
                        aria-label={`Toggle all ${mod.label}`}
                      />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button type="button" onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />}
          Save Permissions
        </Button>
      </DialogFooter>
    </>
  )
}
