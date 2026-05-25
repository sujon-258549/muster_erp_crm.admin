import type { ReactNode } from "react"
import { Outlet } from "react-router-dom"
import { Building2 } from "lucide-react"
import { siteConfig } from "@/config/site"

interface AuthLayoutProps {
  // Optional — when used as a direct wrapper:
  //   <AuthLayout><Login /></AuthLayout>
  // If omitted, falls back to `<Outlet />` so the layout still works as a
  // nested-route element.
  children?: ReactNode
}

// Two-column auth shell — brand panel on the left, form panel on the right.
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: brand panel — hidden on small screens */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-zinc-950 p-10 text-zinc-50 lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(600px circle at 0% 0%, rgba(124,58,237,0.45), transparent 40%), radial-gradient(800px circle at 100% 100%, rgba(56,189,248,0.35), transparent 50%)",
          }}
        />

        <div className="relative flex items-center gap-2 text-lg font-medium">
          <div className="grid size-9 place-items-center rounded-md bg-white/10 backdrop-blur">
            <Building2 className="size-5" />
          </div>
          {siteConfig.name}
        </div>

        <div className="relative space-y-4">
          <blockquote className="text-xl font-light leading-relaxed">
            “Streamline customers, orders, inventory and reports in one
            workspace — built for teams that move fast.”
          </blockquote>
          <p className="text-sm text-zinc-400">— {siteConfig.author}</p>
        </div>
      </aside>

      {/* Right: form panel */}
      <main className="flex items-center justify-center bg-background p-6 sm:p-10">
        <div className="w-full max-w-sm">{children ?? <Outlet />}</div>
      </main>
    </div>
  )
}
