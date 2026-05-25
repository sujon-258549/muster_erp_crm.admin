import { Outlet } from "react-router-dom"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import AppSidebar from "./sidebar"
import Navbar from "./navbar"

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-muted/40">
        <Navbar />
        <main className="flex-1 px-6 pb-6 pt-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
