"use client"

import type { User } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cloud, AlertCircle, TrendingUp, MapPin } from "lucide-react"
import { calculateUserBalance } from "@/lib/data-storage"

interface HomeScreenProps {
  user: User
}

export function HomeScreen({ user }: HomeScreenProps) {
  const balance = calculateUserBalance(user.id)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-RW", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="pb-24 px-4 pt-4 space-y-4 max-w-lg mx-auto">
      {/* Weather Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Today's Weather</p>
              <p className="text-2xl font-bold">23°C</p>
              <p className="text-sm text-muted-foreground">Partly cloudy, light breeze</p>
              <div className="flex gap-2 mt-2 text-xs">
                <span>💧 65%</span>
                <span>💨 12 km/h</span>
              </div>
            </div>
            <Cloud className="w-12 h-12 text-primary" />
          </div>
        </CardContent>
      </Card>

      {/* Balance Card */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="pt-6">
          <p className="text-sm opacity-90 mb-2">Your Account Balance</p>
          <p className="text-3xl font-bold">{formatCurrency(balance)} RWF</p>
        </CardContent>
      </Card>

      {/* AI Advice */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">🤖 AI Crop Advice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            <strong>Today's Tip:</strong> Perfect weather for watering! Apply water early morning or late evening to
            reduce evaporation.
          </p>
          <Button size="sm" className="w-full bg-transparent" variant="outline">
            View More Tips
          </Button>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-orange-900 dark:text-orange-100">Pest Alert</p>
              <p className="text-sm text-orange-800 dark:text-orange-200 mt-1">
                Fall armyworm detected in your district. Apply approved pesticides.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Prices */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Market Prices (Avg.)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm">Maize</span>
            <span className="font-semibold">450 RWF/kg</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm">Beans</span>
            <span className="font-semibold">850 RWF/kg</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm">Tomatoes</span>
            <span className="font-semibold">600 RWF/kg</span>
          </div>
          <Button size="sm" className="w-full bg-transparent" variant="outline">
            View All Prices
          </Button>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">{user.district}</p>
              <p className="text-xs text-muted-foreground">
                {user.sector}, {user.cell}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground pb-4">
        © 2025 AgriAssist Rwanda. All rights reserved. Enzo design.
      </footer>
    </div>
  )
}
