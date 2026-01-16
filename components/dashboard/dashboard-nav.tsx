"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Leaf,
  Wallet,
  ShoppingCart,
  Settings,
  Shield,
  BarChart3,
  Users,
  TrendingUp,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface DashboardNavProps {
  role?: string
}

const userNavItems = [
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

const adminNavItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Admin Panel",
    href: "/dashboard/admin",
    icon: Shield,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

const governmentNavItems = [
  {
    title: "Analytics",
    href: "/dashboard/government",
    icon: BarChart3,
  },
  {
    title: "Farmers",
    href: "/dashboard/government",
    icon: Users,
  },
  {
    title: "Reports",
    href: "/dashboard/government",
    icon: TrendingUp,
  },
]

const buyerNavItems = [
  {
    title: "Marketplace",
    href: "/dashboard/buyer",
    icon: ShoppingCart,
  },
  {
    title: "Farmers",
    href: "/dashboard/buyer",
    icon: Users,
  },
  {
    title: "My Orders",
    href: "/dashboard/buyer",
    icon: LayoutDashboard,
  },
]

const investorNavItems = [
  {
    title: "Analytics",
    href: "/dashboard/investor",
    icon: TrendingUp,
  },
  {
    title: "Performance",
    href: "/dashboard/investor",
    icon: BarChart3,
  },
  {
    title: "Portfolio",
    href: "/dashboard/investor",
    icon: Wallet,
  },
]

export function DashboardNav({ role }: DashboardNavProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  const userRole = role || user?.role || "user"

  let displayNavItems = userNavItems
  if (userRole === "admin") {
    displayNavItems = adminNavItems
  } else if (userRole === "government_officer") {
    displayNavItems = governmentNavItems
  } else if (userRole === "buyer") {
    displayNavItems = buyerNavItems
  } else if (userRole === "investor") {
    displayNavItems = investorNavItems
  }

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
