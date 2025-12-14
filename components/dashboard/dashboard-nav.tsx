"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Leaf, Wallet, ShoppingCart, Settings, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Farm Management",
    href: "/dashboard/farm",
    icon: Leaf,
  },
  {
    title: "Finances",
    href: "/dashboard/finances",
    icon: Wallet,
  },
  {
    title: "Market",
    href: "/dashboard/market",
    icon: ShoppingCart,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

const adminNavItem = {
  title: "Admin Panel",
  href: "/dashboard/admin",
  icon: Shield,
}

export function DashboardNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  const displayNavItems = user?.role === "admin" ? [...navItems, adminNavItem] : navItems

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto">
          {displayNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
