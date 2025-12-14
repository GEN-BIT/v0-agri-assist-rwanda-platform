import type { Crop, Livestock, FarmInput, MarketPrice, Transaction } from "@/types"
import { demoMarketPrices, demoCrops, demoLivestock, demoTransactions } from "./demo-data"

// Crops Storage
export const getCrops = (userId?: string): Crop[] => {
  if (typeof window === "undefined") return []
  const crops = localStorage.getItem("agriassist_crops")
  const allCrops = crops ? JSON.parse(crops) : []
  return userId ? allCrops.filter((c: Crop) => c.user_id === userId) : allCrops
}

export const saveCrop = (crop: Crop): void => {
  const crops = getCrops()
  const existingIndex = crops.findIndex((c) => c.id === crop.id)
  if (existingIndex >= 0) {
    crops[existingIndex] = crop
  } else {
    crops.push(crop)
  }
  localStorage.setItem("agriassist_crops", JSON.stringify(crops))
}

export const deleteCrop = (cropId: string): void => {
  const crops = getCrops()
  const filtered = crops.filter((c) => c.id !== cropId)
  localStorage.setItem("agriassist_crops", JSON.stringify(filtered))
}

// Livestock Storage
export const getLivestock = (userId?: string): Livestock[] => {
  if (typeof window === "undefined") return []
  const livestock = localStorage.getItem("agriassist_livestock")
  const allLivestock = livestock ? JSON.parse(livestock) : []
  return userId ? allLivestock.filter((l: Livestock) => l.user_id === userId) : allLivestock
}

export const saveLivestock = (livestock: Livestock): void => {
  const allLivestock = getLivestock()
  const existingIndex = allLivestock.findIndex((l) => l.id === livestock.id)
  if (existingIndex >= 0) {
    allLivestock[existingIndex] = livestock
  } else {
    allLivestock.push(livestock)
  }
  localStorage.setItem("agriassist_livestock", JSON.stringify(allLivestock))
}

export const deleteLivestock = (livestockId: string): void => {
  const livestock = getLivestock()
  const filtered = livestock.filter((l) => l.id !== livestockId)
  localStorage.setItem("agriassist_livestock", JSON.stringify(filtered))
}

// Farm Inputs Storage
export const getFarmInputs = (userId?: string): FarmInput[] => {
  if (typeof window === "undefined") return []
  const inputs = localStorage.getItem("agriassist_inputs")
  const allInputs = inputs ? JSON.parse(inputs) : []
  return userId ? allInputs.filter((i: FarmInput) => i.user_id === userId) : allInputs
}

export const saveFarmInput = (input: FarmInput): void => {
  const inputs = getFarmInputs()
  const existingIndex = inputs.findIndex((i) => i.id === input.id)
  if (existingIndex >= 0) {
    inputs[existingIndex] = input
  } else {
    inputs.push(input)
  }
  localStorage.setItem("agriassist_inputs", JSON.stringify(inputs))
}

export const deleteFarmInput = (inputId: string): void => {
  const inputs = getFarmInputs()
  const filtered = inputs.filter((i) => i.id !== inputId)
  localStorage.setItem("agriassist_inputs", JSON.stringify(filtered))
}

// Market Prices Storage
export const getMarketPrices = (): MarketPrice[] => {
  if (typeof window === "undefined") return []
  const prices = localStorage.getItem("agriassist_market_prices")
  return prices ? JSON.parse(prices) : []
}

export const saveMarketPrice = (price: MarketPrice): void => {
  const prices = getMarketPrices()
  const existingIndex = prices.findIndex((p) => p.id === price.id)
  if (existingIndex >= 0) {
    prices[existingIndex] = price
  } else {
    prices.push(price)
  }
  localStorage.setItem("agriassist_market_prices", JSON.stringify(prices))
}

// Transactions Storage
export const getTransactions = (userId?: string): Transaction[] => {
  if (typeof window === "undefined") return []
  const transactions = localStorage.getItem("agriassist_transactions")
  const allTransactions = transactions ? JSON.parse(transactions) : []
  return userId ? allTransactions.filter((t: Transaction) => t.user_id === userId) : allTransactions
}

export const saveTransaction = (transaction: Transaction): void => {
  const transactions = getTransactions()
  transactions.push(transaction)
  localStorage.setItem("agriassist_transactions", JSON.stringify(transactions))
}

export const deleteTransaction = (transactionId: string): void => {
  const transactions = getTransactions()
  const filtered = transactions.filter((t) => t.id !== transactionId)
  localStorage.setItem("agriassist_transactions", JSON.stringify(filtered))
}

// Calculate user balance from transactions
export const calculateUserBalance = (userId: string): number => {
  const transactions = getTransactions(userId)
  const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const expenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  return income - expenses
}

export const initializeDefaultData = (): void => {
  if (typeof window === "undefined") return

  if (!localStorage.getItem("agriassist_market_prices")) {
    localStorage.setItem("agriassist_market_prices", JSON.stringify(demoMarketPrices))
  }
  if (!localStorage.getItem("agriassist_crops")) {
    localStorage.setItem("agriassist_crops", JSON.stringify(demoCrops))
  }
  if (!localStorage.getItem("agriassist_livestock")) {
    localStorage.setItem("agriassist_livestock", JSON.stringify(demoLivestock))
  }
  if (!localStorage.getItem("agriassist_transactions")) {
    localStorage.setItem("agriassist_transactions", JSON.stringify(demoTransactions))
  }
}
