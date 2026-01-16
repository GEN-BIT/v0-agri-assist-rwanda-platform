import type { User } from "@/types"

export function getRedirectPath(user: User | null): string {
  if (!user) return "/"

  switch (user.role) {
    case "admin":
      return "/dashboard/admin"
    case "government_officer":
      return "/dashboard/government"
    case "buyer":
      return "/dashboard/buyer"
    case "investor":
      return "/dashboard/investor"
    case "user":
    default:
      return "/dashboard"
  }
}
