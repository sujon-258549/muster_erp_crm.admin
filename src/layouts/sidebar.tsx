import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { Building2, ChevronRight, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useAppDispatch } from "@/redux/hooks"
import { performLogout } from "@/redux/features/auth/auth-slice"
import { useCurrentUser } from "@/hooks/use-permission"
import { hasAction, isSuperAdmin } from "@/lib/permissions"
import { MODULES, type AppModule, type AppModuleChild } from "@/config/modules"
import { ROUTES } from "@/config/paths"
import { siteConfig } from "@/config/site"

export default function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const user = useCurrentUser()

  // Sidebar visibility — a module appears only if the user has the `read`
  // action on it. Super-admin sees everything.
  //   - Parent with children → keep child if `read` granted on its key;
  //     drop the whole parent if no child has read.
  //   - Top-level (no children) → check `read` on the parent's own key.
  const accessibleModules: AppModule[] = (() => {
    if (!user) return []
    if (isSuperAdmin(user)) return MODULES

    const result: AppModule[] = []
    for (const mod of MODULES) {
      if (mod.children && mod.children.length > 0) {
        const visibleChildren: AppModuleChild[] = mod.children.filter((c) =>
          hasAction(user, c.key, "read"),
        )
        if (visibleChildren.length > 0) {
          result.push({ ...mod, children: visibleChildren })
        }
      } else if (hasAction(user, mod.key, "read")) {
        result.push(mod)
      }
    }
    return result
  })()

  const isChildActive = (children?: AppModule["children"]) =>
    children?.some((c) => location.pathname.startsWith(c.path.split("?")[0])) ??
    false

  const handleLogout = () => {
    dispatch(performLogout())
    navigate(ROUTES.AUTH.LOGIN, { replace: true })
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link to={ROUTES.MODULES.DASHBOARD}>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{siteConfig.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    ERP & CRM
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2.5">
              {accessibleModules.map((mod) => {
                if (mod.children?.length) {
                  return (
                    <Collapsible
                      key={mod.key}
                      defaultOpen={isChildActive(mod.children)}
                      className="group/collapsible"
                      asChild
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton tooltip={mod.label} className="font-medium">
                            <mod.icon />
                            <span>{mod.label}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                          <SidebarMenuSub className="gap-1.5">
                            {mod.children.map((sub) => (
                              <SidebarMenuSubItem key={sub.path}>
                                <SidebarMenuSubButton asChild>
                                  <NavLink
                                    to={sub.path}
                                    className={({ isActive }) =>
                                      isActive
                                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                                        : "font-medium"
                                    }
                                  >
                                    {sub.label}
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  )
                }

                return (
                  <SidebarMenuItem key={mod.key}>
                    <SidebarMenuButton asChild tooltip={mod.label} className="font-medium">
                      <NavLink
                        to={mod.path}
                        end={mod.path === ROUTES.MODULES.DASHBOARD}
                        className={({ isActive }) =>
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                            : ""
                        }
                      >
                        <mod.icon />
                        <span>{mod.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              onClick={handleLogout}
              className="font-medium text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:ring-destructive/40"
            >
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
