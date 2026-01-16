"use client"

import type React from "react"
import { Home, Leaf, Lightbulb, TrendingUp, Wallet } from "lucide-react"

export type FarmerTab = "home" | "farm" | "advice" | "market" | "wallet"

interface MobileNavProps {
  activeTab: FarmerTab
  onTabChange: (tab: FarmerTab) => void
}

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  const tabs: Array<{ id: FarmerTab; label: string; icon: React.ReactNode }> = [
    { id: "home", label: "Home", icon: <Home className="w-6 h-6" /> },
    { id: "farm", label: "My Farm", icon: <Leaf className="w-6 h-6" /> },
    { id: "advice", label: "Advice", icon: <Lightbulb className="w-6 h-6" /> },
    { id: "market", label: "Market", icon: <TrendingUp className="w-6 h-6" /> },
    { id: "wallet", label: "Wallet", icon: <Wallet className="w-6 h-6" /> },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="flex justify-around items-center h-20 max-w-lg mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
              activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon}
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
