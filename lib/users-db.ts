import type { User } from "@/types"

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

// Initialize the database with admin user
export function initializeDatabase() {
  if (typeof window === "undefined") return

  const existingData = localStorage.getItem(USERS_KEY)
  if (!existingData) {
    localStorage.setItem(USERS_KEY, JSON.stringify([ADMIN_USER]))
  } else {
    // Ensure admin user exists
    const users = JSON.parse(existingData) as User[]
    const adminExists = users.some((u) => u.email === ADMIN_USER.email)
    if (!adminExists) {
      users.unshift(ADMIN_USER)
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
    }
  }
}

// Get all users from database
export function getAllUsers(): User[] {
  if (typeof window === "undefined") return []

  const data = localStorage.getItem(USERS_KEY)
  return data ? JSON.parse(data) : [ADMIN_USER]
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
