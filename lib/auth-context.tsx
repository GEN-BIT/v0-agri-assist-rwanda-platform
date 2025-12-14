"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { AuthContextType, User } from "@/types"
import { getUserByCredentials, getAllUsers, initializeDatabase } from "@/lib/users-db"
import { initializeDefaultData } from "@/lib/data-storage"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_USERS: User[] = [
  {
    id: "1",
    email: "jean@example.com",
    full_name: "Jean Baptiste Uwimana",
    phone_number: "+250788123456",
    province: "Kigali City",
    district: "Gasabo",
    farm_size: 5,
    farm_type: "Mixed Farming",
    role: "user",
    created_at: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    email: "marie@example.com",
    full_name: "Marie Mukamana",
    phone_number: "+250789234567",
    province: "Southern Province",
    district: "Huye",
    farm_size: 3.5,
    farm_type: "Crop Farming",
    role: "user",
    created_at: "2024-02-20T14:45:00Z",
  },
  {
    id: "3",
    email: "patrick@example.com",
    full_name: "Patrick Nkurunziza",
    phone_number: "+250780345678",
    province: "Eastern Province",
    district: "Nyagatare",
    farm_size: 12,
    farm_type: "Livestock",
    role: "user",
    created_at: "2024-01-10T09:15:00Z",
  },
  {
    id: "4",
    email: "grace@example.com",
    full_name: "Grace Uwase",
    phone_number: "+250781456789",
    province: "Western Province",
    district: "Rubavu",
    farm_size: 2.5,
    farm_type: "Horticulture",
    role: "user",
    created_at: "2024-03-05T16:20:00Z",
  },
  {
    id: "5",
    email: "david@example.com",
    full_name: "David Mugisha",
    phone_number: "+250782567890",
    province: "Northern Province",
    district: "Musanze",
    farm_size: 8,
    farm_type: "Mixed Farming",
    role: "user",
    created_at: "2024-02-12T11:00:00Z",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeDatabase()
    initializeDefaultData()

    const storedUser = localStorage.getItem("agriassist_user")
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)

      if (parsedUser?.role === "admin") {
        document.documentElement.classList.add("admin-theme")
      } else {
        document.documentElement.classList.remove("admin-theme")
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    const authenticatedUser = getUserByCredentials(email, password)

    if (!authenticatedUser) {
      throw new Error("Invalid email or password")
    }

    const { password: _, ...userWithoutPassword } = authenticatedUser
    localStorage.setItem("agriassist_user", JSON.stringify(userWithoutPassword))
    setUser(userWithoutPassword)

    if (userWithoutPassword.role === "admin") {
      document.documentElement.classList.add("admin-theme")
    }
  }

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    throw new Error("Public registration is disabled. Please contact an administrator.")
  }

  const signOut = async () => {
    localStorage.removeItem("agriassist_user")
    setUser(null)
    document.documentElement.classList.remove("admin-theme")
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export { getAllUsers }
