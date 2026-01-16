"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"
import { EnzoChatbot } from "@/components/chatbot/enzo-chatbot"
import { MobileNav, type FarmerTab } from "@/components/farmer/mobile-nav"
import { HomeScreen } from "@/components/farmer/home-screen"
import { FarmScreen } from "@/components/farmer/farm-screen"
import { AdviceScreen } from "@/components/farmer/advice-screen"
import { MarketScreen } from "@/components/farmer/market-screen"
import { WalletScreen } from "@/components/farmer/wallet-screen"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<FarmerTab>("home")
  const [refreshKey, setRefreshKey] = useState(0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    redirect("/")
  }

  // Redirect admin and other roles to their dashboards
  if (user.role === "admin") redirect("/dashboard/admin")
  if (user.role === "government_officer") redirect("/dashboard/government")
  if (user.role === "buyer") redirect("/dashboard/buyer")
  if (user.role === "investor") redirect("/dashboard/investor")

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      {/* Render active screen based on tab */}
      {activeTab === "home" && <HomeScreen user={user} />}
      {activeTab === "farm" && <FarmScreen user={user} refreshKey={refreshKey} onRefresh={handleRefresh} />}
      {activeTab === "advice" && <AdviceScreen />}
      {activeTab === "market" && <MarketScreen />}
      {activeTab === "wallet" && <WalletScreen user={user} />}

      {/* Bottom Navigation */}
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* ENZO Chatbot */}
      {user.role === "user" && <EnzoChatbot />}
    </div>
  )
}
