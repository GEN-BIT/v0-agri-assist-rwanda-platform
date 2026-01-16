import type { User } from "@/types"
import { getTransactions as getTransactionsFromStorage } from "@/lib/data-storage"

const USERS_KEY = "agriassist_users_db"
const ADMIN_USER: User = {
  id: "admin-001",
  email: "ihirweenzo@yahoo.com",
  password: "enzo20090524", // In production, this would be hashed
  full_name: "System Administrator",
  id_card_number: "1199900000000001",
  phone_number: "+250788000000",
  province: "Kigali City",
  district: "Gasabo",
  role: "admin",
  balance: 0,
  created_at: new Date().toISOString(),
}

const DEMO_ACCOUNTS: User[] = [
  {
    id: "gov-001",
    email: "officer@minagri.gov.rw",
    password: "officer123",
    full_name: "Jean Paul Ndayisenga",
    phone_number: "+250788111111",
    province: "Kigali City",
    district: "Gasabo",
    role: "government_officer",
    ministry: "Ministry of Agriculture (MINAGRI)",
    designation: "Agricultural Extension Officer",
    created_at: new Date().toISOString(),
  },
  {
    id: "buyer-001",
    email: "buyer@rwandatraders.com",
    password: "buyer123",
    full_name: "Muhoza Trading Company",
    phone_number: "+250789222222",
    province: "Kigali City",
    district: "Nyarugenge",
    role: "buyer",
    buyer_type: "company",
    buyer_products: ["Maize", "Beans", "Rice", "Vegetables"],
    created_at: new Date().toISOString(),
  },
  {
    id: "investor-001",
    email: "investor@agroventures.rw",
    password: "investor123",
    full_name: "AgriVentures Ltd",
    phone_number: "+250788333333",
    province: "Kigali City",
    district: "Kicukiro",
    role: "investor",
    investment_amount: 50000000,
    investment_focus: "Agricultural Technology & Farmer Support",
    created_at: new Date().toISOString(),
  },
]

// Initialize the database with admin user and demo accounts
export function initializeDatabase() {
  if (typeof window === "undefined") return

  const existingData = localStorage.getItem(USERS_KEY)
  if (!existingData) {
    localStorage.setItem(USERS_KEY, JSON.stringify([ADMIN_USER, ...DEMO_ACCOUNTS]))
  } else {
    const users = JSON.parse(existingData) as User[]
    const adminExists = users.some((u) => u.email === ADMIN_USER.email)
    if (!adminExists) {
      users.unshift(ADMIN_USER)
    }
    DEMO_ACCOUNTS.forEach((demoUser) => {
      if (!users.some((u) => u.email === demoUser.email)) {
        users.push(demoUser)
      }
    })
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }
}

// Get all users from database
export function getAllUsers(): User[] {
  if (typeof window === "undefined") return []

  const data = localStorage.getItem(USERS_KEY)
  return data ? JSON.parse(data) : [ADMIN_USER, ...DEMO_ACCOUNTS]
}

// Get user by email and password
export function getUserByCredentials(email: string, password: string): User | null {
  const users = getAllUsers()
  return users.find((u) => u.email === email && u.password === password) || null
}

// Add new user (admin only)
export function addUser(userData: Omit<User, "id" | "created_at">): User {
  const users = getAllUsers()

  const newUser: User = {
    ...userData,
    id: `user-${Date.now()}`,
    balance: userData.balance ?? 0,
    created_at: new Date().toISOString(),
  }

  users.push(newUser)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))

  return newUser
}

// Update user
export function updateUser(userId: string, updates: Partial<User>): User | null {
  const users = getAllUsers()
  const index = users.findIndex((u) => u.id === userId)

  if (index === -1) return null

  users[index] = { ...users[index], ...updates }
  localStorage.setItem(USERS_KEY, JSON.stringify(users))

  return users[index]
}

// Delete user
export function deleteUser(userId: string): boolean {
  const users = getAllUsers()
  const filtered = users.filter((u) => u.id !== userId)

  if (filtered.length === users.length) return false

  localStorage.setItem(USERS_KEY, JSON.stringify(filtered))
  return true
}

// Check if email exists
export function emailExists(email: string): boolean {
  const users = getAllUsers()
  return users.some((u) => u.email === email)
}

export const getTransactions = getTransactionsFromStorage
