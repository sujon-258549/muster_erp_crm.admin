import { useMemo, useState } from "react"
import { Loader2, RotateCcw, Search, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ACTION_LABEL,
  DISTINCT_ACTIONS,
  PERMISSION_CATALOG,
  TOTAL_PERMISSION_COUNT,
  type PermissionCatalogItem,
} from "@/config/permission-catalog"
import type { RolePermission } from "@/redux/features/permissions"
import { useRolePermission } from "@/hooks/data-fetch"
import type { Role } from "@/redux/features/roles"
import { getErrorMessage } from "@/lib/errors"
import { cn } from "@/lib/utils"

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
      <DialogContent className="flex h-[95vh] max-h-[95vh] w-[90vw] flex-col gap-0 overflow-hidden p-0 sm:max-w-[90vw]">
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

// In-memory state: which actions are granted per module key. Hydrated from
// the server on first render, then becomes the source of truth for edits.
type PermissionGrid = Record<string, Set<string>>

function buildGridFromServer(
  rows: RolePermission[] | undefined,
): PermissionGrid {
  const grid: PermissionGrid = {}
  if (!rows) return grid
  for (const row of rows) {
    if (!row.module) continue
    grid[row.module] = new Set(row.permissions ?? [])
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
    replaceRolePermissions,
  } = useRolePermission({ roleId: role.id })

  const [grid, setGrid] = useState<PermissionGrid | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const effectiveGrid = grid ?? buildGridFromServer(rolePermissions)

  const updateGrid = (fn: (current: PermissionGrid) => PermissionGrid) =>
    setGrid((prev) => fn(prev ?? buildGridFromServer(rolePermissions)))

  const toggleAction = (moduleKey: string, action: string) =>
    updateGrid((current) => {
      const next = { ...current }
      const actions = new Set(next[moduleKey] ?? [])
      if (actions.has(action)) actions.delete(action)
      else actions.add(action)
      next[moduleKey] = actions
      return next
    })

  const toggleAllForModule = (moduleKey: string) =>
    updateGrid((current) => {
      const item = PERMISSION_CATALOG.find((i) => i.key === moduleKey)
      if (!item) return current
      const actions = current[moduleKey] ?? new Set<string>()
      const hasAll = item.actions.every((a) => actions.has(a))
      return {
        ...current,
        [moduleKey]: hasAll ? new Set() : new Set<string>(item.actions),
      }
    })

  // Grant one action across every module that declares it; modules without
  // the action are skipped (e.g. "permission" only exists on `roles`).
  const grantActionToAllModules = (action: string) =>
    updateGrid((current) => {
      const next: PermissionGrid = { ...current }
      for (const item of PERMISSION_CATALOG) {
        if (!item.actions.includes(action)) continue
        const actions = new Set(next[item.key] ?? [])
        actions.add(action)
        next[item.key] = actions
      }
      return next
    })

  const selectAllPermissions = () =>
    updateGrid(() => {
      const next: PermissionGrid = {}
      for (const item of PERMISSION_CATALOG) {
        next[item.key] = new Set<string>(item.actions)
      }
      return next
    })

  const clearAllPermissions = () => updateGrid(() => ({}))

  // Single atomic call — server upserts every module and deletes the ones
  // whose action list is empty. Sending the whole catalog (even untouched
  // modules with empty arrays) keeps client + DB consistent in one round-trip.
  const handleSave = async () => {
    setIsSaving(true)
    try {
      const payload = PERMISSION_CATALOG.map((item) => ({
        module: item.key,
        permissions: Array.from(effectiveGrid[item.key] ?? []),
      }))
      await replaceRolePermissions({
        roleId: role.id,
        permissions: payload,
      }).unwrap()
      toast.success("Permissions updated")
      onClose()
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to save permissions"))
    } finally {
      setIsSaving(false)
    }
  }

  const grantedCount = PERMISSION_CATALOG.reduce(
    (sum, item) => sum + (effectiveGrid[item.key]?.size ?? 0),
    0,
  )
  const isEverythingSelected =
    TOTAL_PERMISSION_COUNT > 0 && grantedCount === TOTAL_PERMISSION_COUNT

  const visibleItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return PERMISSION_CATALOG
    return PERMISSION_CATALOG.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.parentLabel?.toLowerCase().includes(query),
    )
  }, [searchTerm])

  const showLoadingState =
    isRolePermissionLoading && rolePermissions.length === 0

  // Three sticky regions so the Save button is never clipped: fixed header,
  // scrolling middle, fixed footer.
  return (
    <>
      <div className="shrink-0 border-b border-border px-6 pt-6 pb-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            Permissions — {role.role ?? "—"}
          </DialogTitle>
          <DialogDescription>
            Configure system access for {role.role ?? "this role"}. Sub-modules
            are individual permissions — toggle actions per page.
          </DialogDescription>
        </DialogHeader>

        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search modules…"
            className="pl-9"
          />
        </div>

        <QuickGrantBar
          grantedCount={grantedCount}
          totalCount={TOTAL_PERMISSION_COUNT}
          onGrantAction={grantActionToAllModules}
          onClear={clearAllPermissions}
        />

        <label className="mt-3 flex w-fit cursor-pointer select-none items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            className="size-4 cursor-pointer accent-primary"
            checked={isEverythingSelected}
            onChange={(e) =>
              e.target.checked
                ? selectAllPermissions()
                : clearAllPermissions()
            }
          />
          Select all system permissions
        </label>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
        {showLoadingState ? (
          <div className="flex justify-center py-12 text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : visibleItems.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No modules match “{searchTerm}”.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleItems.map((item) => (
              <PermissionCard
                key={item.key}
                item={item}
                actions={effectiveGrid[item.key] ?? new Set()}
                onToggleAction={(action) => toggleAction(item.key, action)}
                onToggleAll={() => toggleAllForModule(item.key)}
              />
            ))}
          </div>
        )}
      </div>

      <DialogFooter className="shrink-0 border-t border-border bg-muted/20 px-6 py-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button type="button" onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="size-4 animate-spin" />}
          Save Permissions
        </Button>
      </DialogFooter>
    </>
  )
}

function QuickGrantBar({
  grantedCount,
  totalCount,
  onGrantAction,
  onClear,
}: {
  grantedCount: number
  totalCount: number
  onGrantAction: (action: string) => void
  onClear: () => void
}) {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-md border bg-muted/30 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Quick Grant
        </span>
        {DISTINCT_ACTIONS.map((action) => (
          <Button
            key={action}
            type="button"
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={() => onGrantAction(action)}
          >
            {ACTION_LABEL[action] ?? action} All
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
            Selection Progress
          </div>
          <div className="text-sm font-semibold text-primary">
            {grantedCount} / {totalCount} selected
          </div>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 text-xs"
          onClick={onClear}
        >
          <RotateCcw className="size-3" /> Reset All
        </Button>
      </div>
    </div>
  )
}

function PermissionCard({
  item,
  actions,
  onToggleAction,
  onToggleAll,
}: {
  item: PermissionCatalogItem
  actions: Set<string>
  onToggleAction: (action: string) => void
  onToggleAll: () => void
}) {
  const Icon = item.icon
  const hasAll = item.actions.every((a) => actions.has(a))
  const hasAny = actions.size > 0

  return (
    <div
      className={cn(
        "rounded-md border bg-card p-3 shadow-xs transition-colors",
        hasAny && "border-primary/40 bg-primary/5",
      )}
    >
      <div className="flex items-start justify-between gap-2 border-b border-border/60 pb-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <Icon className="size-4 shrink-0 text-primary" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="truncate font-medium">{item.label}</span>
              {hasAny && (
                <Badge variant="secondary" className="text-[10px]">
                  {actions.size}/{item.actions.length}
                </Badge>
              )}
            </div>
            {item.parentLabel && (
              <div className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">
                {item.parentLabel}
              </div>
            )}
          </div>
        </div>
        <label className="flex shrink-0 cursor-pointer items-center gap-1 text-[11px] text-muted-foreground">
          <input
            type="checkbox"
            className="size-3.5 cursor-pointer accent-primary"
            checked={hasAll}
            onChange={onToggleAll}
            aria-label={`Toggle all ${item.label}`}
          />
          All
        </label>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.actions.map((action) => {
          const isGranted = actions.has(action)
          return (
            <button
              key={action}
              type="button"
              onClick={() => onToggleAction(action)}
              className={cn(
                "rounded-[6px] border px-3 py-1 text-[11px] font-semibold shadow-xs transition-colors",
                isGranted
                  ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border-input bg-background text-muted-foreground hover:border-primary/60 hover:text-foreground",
              )}
            >
              {ACTION_LABEL[action] ?? action}
            </button>
          )
        })}
      </div>
    </div>
  )
}
