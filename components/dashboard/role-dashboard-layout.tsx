"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import type { ReactNode } from "react"

interface RoleDashboardLayoutProps {
  children: ReactNode
  allowedRoles: string[]
  title: string
}

export function RoleDashboardLayout({ children, allowedRoles, title }: RoleDashboardLayoutProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || !allowedRoles.includes(user.role || ""))) {
      router.push("/")
    }
  }, [user, loading, allowedRoles, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user || !allowedRoles.includes(user.role || "")) {
    return null
  }

  return <>{children}</>
}
