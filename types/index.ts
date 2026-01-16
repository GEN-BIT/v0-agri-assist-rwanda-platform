export interface User {
  id: string
  email: string
  password?: string // Added password field for authentication
  full_name: string
  id_card_number?: string // Added ID card number field
  phone_number?: string
  province?: string
  district?: string
  sector?: string // Added detailed location fields
  cell?: string
  village?: string
  profile_picture?: string // Added profile picture URL field
  farm_size?: number
  farm_type?: string
  role?: "admin" | "user" | "government_officer" | "buyer" | "investor" // Added new role types for government officers, buyers, and investors
  balance?: number // Added account balance field initialized to 0 RWF
  created_at: string
  ministry?: string // Added government officer specific fields
  designation?: string
  buyer_type?: string // Added buyer specific fields
  buyer_products?: string[]
  investment_amount?: number // Added investor specific fields
  investment_focus?: string
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>
  signOut: () => Promise<void>
}

export const RWANDA_PROVINCES = [
  "Kigali City",
  "Eastern Province",
  "Northern Province",
  "Southern Province",
  "Western Province",
] as const

export const DISTRICTS_BY_PROVINCE: Record<string, string[]> = {
  "Kigali City": ["Gasabo", "Kicukiro", "Nyarugenge"],
  "Eastern Province": ["Bugesera", "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Nyagatare", "Rwamagana"],
  "Northern Province": ["Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo"],
  "Southern Province": ["Gisagara", "Huye", "Kamonyi", "Muhanga", "Nyamagabe", "Nyanza", "Nyaruguru", "Ruhango"],
  "Western Province": ["Karongi", "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rusizi", "Rutsiro"],
}

export const FARM_TYPES = [
  "Crop Farming",
  "Livestock",
  "Mixed Farming",
  "Poultry",
  "Fish Farming",
  "Horticulture",
] as const

export interface Crop {
  id: string
  user_id: string
  name: string
  variety?: string
  area: number
  planting_date: string
  expected_harvest_date?: string
  actual_harvest_date?: string
  status: "planted" | "growing" | "harvested" | "failed"
  yield_amount?: number
  yield_unit?: string
  notes?: string
  created_at: string
}

export interface Livestock {
  id: string
  user_id: string
  type: string
  breed?: string
  count: number
  acquisition_date: string
  purpose: string
  health_status: "healthy" | "sick" | "vaccinated" | "quarantine"
  notes?: string
  created_at: string
}

export interface FarmInput {
  id: string
  user_id: string
  type: "fertilizer" | "pesticide" | "seed" | "feed" | "other"
  name: string
  quantity: number
  unit: string
  cost: number
  application_date: string
  applied_to?: string
  notes?: string
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: "income" | "expense"
  category: string
  amount: number
  description: string
  date: string
  payment_method?: string
  notes?: string
  created_at: string
}

export interface MarketPrice {
  id: string
  product: string
  category: string
  price_per_unit: number
  unit: string
  market_location: string
  district: string
  province: string
  sector?: string // Added location detail fields for market prices
  cell?: string
  village?: string
  last_updated: string
  trend?: "up" | "down" | "stable"
}

export interface Buyer {
  id: string
  name: string
  type: "individual" | "cooperative" | "company" | "export"
  products_buying: string[]
  location: string
  district: string
  province: string
  contact_phone?: string
  contact_email?: string
  rating?: number
  verified: boolean
}

export const INCOME_CATEGORIES = [
  "Crop Sales",
  "Livestock Sales",
  "Milk Sales",
  "Egg Sales",
  "Government Subsidy",
  "Loan",
  "Other Income",
] as const

export const EXPENSE_CATEGORIES = [
  "Seeds & Planting",
  "Fertilizers",
  "Pesticides",
  "Animal Feed",
  "Veterinary Services",
  "Labor Costs",
  "Equipment",
  "Transport",
  "Water & Irrigation",
  "Loan Repayment",
  "Other Expense",
] as const

export const PAYMENT_METHODS = ["Cash", "Mobile Money", "Bank Transfer", "Credit"] as const

export const CROP_TYPES = [
  "Maize",
  "Beans",
  "Rice",
  "Wheat",
  "Cassava",
  "Sweet Potatoes",
  "Irish Potatoes",
  "Bananas",
  "Coffee",
  "Tea",
  "Tomatoes",
  "Cabbage",
  "Carrots",
  "Onions",
  "Other",
] as const

export const LIVESTOCK_TYPES = ["Cattle", "Goats", "Sheep", "Pigs", "Chickens", "Ducks", "Rabbits", "Other"] as const

export const LIVESTOCK_PURPOSES = [
  "Meat Production",
  "Milk Production",
  "Egg Production",
  "Breeding",
  "Mixed Purpose",
] as const
