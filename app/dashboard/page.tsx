"use client"

import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { StatCard } from "@/components/dashboard/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, Wallet, TrendingUp, Package, Plus, Calendar } from "lucide-react"
import { EnzoChatbot } from "@/components/chatbot/enzo-chatbot"
import { calculateUserBalance } from "@/lib/data-storage"

export default function DashboardPage() {
  const { user, loading } = useAuth()

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

  const actualBalance = user.role === "user" ? calculateUserBalance(user.id) : user.balance || 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-RW", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardNav />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user.full_name.split(" ")[0]}!</h2>
          <p className="text-muted-foreground">
            Here's an overview of your {user.farm_type?.toLowerCase() || "farm"} in {user.district}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Farm Size"
            value={`${user.farm_size || 0} ha`}
            icon={Leaf}
            colorClass="bg-secondary/10 text-secondary"
          />
          <StatCard
            title="Account Balance"
            value={`${formatCurrency(actualBalance)} RWF`}
            icon={Wallet}
            colorClass="bg-success/10 text-success"
          />
          <StatCard title="Active Crops" value="6" icon={Package} colorClass="bg-accent/10 text-accent" />
          <StatCard
            title="Market Price Avg"
            value="850 RWF/kg"
            icon={TrendingUp}
            trend={{ value: "5% from last week", positive: true }}
            colorClass="bg-primary/10 text-primary"
          />
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks to manage your farm</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <a href="/dashboard/farm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Crop
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <a href="/dashboard/finances">
                  <Wallet className="mr-2 h-4 w-4" />
                  Record Transaction
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <a href="/dashboard/market">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Check Market Prices
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest farm updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Maize harvest completed</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                    <Wallet className="w-5 h-5 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Income recorded: 150,000 RWF</p>
                    <p className="text-xs text-muted-foreground">5 days ago</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Fertilizer applied to beans</p>
                    <p className="text-xs text-muted-foreground">1 week ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Tasks
            </CardTitle>
            <CardDescription>Don't forget these important activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <p className="font-medium">Apply pesticides to tomatoes</p>
                  <p className="text-sm text-muted-foreground">Due in 2 days</p>
                </div>
                <Button size="sm">Mark Done</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <p className="font-medium">Check irrigation system</p>
                  <p className="text-sm text-muted-foreground">Due in 5 days</p>
                </div>
                <Button size="sm">Mark Done</Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <p className="font-medium">Harvest sweet potatoes</p>
                  <p className="text-sm text-muted-foreground">Due in 1 week</p>
                </div>
                <Button size="sm">Mark Done</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 AgriAssist Rwanda. All rights reserved. Enzo design.
          </p>
        </footer>
      </main>

      {user.role === "user" && <EnzoChatbot />}
    </div>
  )
}
