import { Outlet } from "react-router-dom"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { ForceReloadWatcher } from "@/components/shared"
import AppSidebar from "./sidebar"
import Navbar from "./navbar"

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      {/* `min-w-0` on the inset stops a wide child (e.g. a DataTable) from
          pushing the whole layout sideways. Combined with the page-area's
          own min-w-0 + overflow-x-hidden, only the DataTable scrolls. */}
      <SidebarInset className="min-w-0 bg-muted/40">
        <Navbar />
        <main className="min-w-0 flex-1 overflow-x-hidden px-6 pb-6 pt-4">
          <Outlet />
        </main>
      </SidebarInset>
      {/* Polls /my-data + reloads the window when the server flags this
          user's permissions as changed. */}
      <ForceReloadWatcher />
    </SidebarProvider>
  )
}
