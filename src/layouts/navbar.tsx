import { useEffect } from "react"
import { LogOut, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { performLogout, userUpdated } from "@/redux/features/auth/auth-slice"
import { useGetMyDataQuery } from "@/redux/features/users/users-api"
import ThemeSwitcher from "./theme-switcher"

export default function Navbar() {
  const cachedUser = useAppSelector((s) => s.auth.user)
  const dispatch = useAppDispatch()

  // Source of truth: backend /users/my-data. transformResponse in users-api
  // has already normalized the payload (profile.name → name, role object → string).
  const { data: meRes } = useGetMyDataQuery()
  const apiUser = meRes?.data
  const user = apiUser ?? cachedUser

  console.log("Navbar render — user:", apiUser)

  useEffect(() => {
    if (apiUser) dispatch(userUpdated(apiUser))
  }, [apiUser, dispatch])

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-5" />
      {user?.name && (
        <h1 className="text-sm font-medium text-foreground">
          Welcome to{" "}
          <span className="font-semibold text-primary">{user.name}</span>
        </h1>
      )}

      <div className="ml-auto flex items-center gap-1">
        <ThemeSwitcher />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="size-7">
                <AvatarFallback>
                  {user?.name?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col">
              <span className="font-medium">{user?.name ?? "Account"}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {user?.email ?? ""}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon className="size-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => dispatch(performLogout())}>
              <LogOut className="size-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
