"use client"

import { useAuth } from "@/lib/auth-context"
import { RoleDashboardLayout } from "@/components/dashboard/role-dashboard-layout"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllUsers } from "@/lib/users-db"
import { getTransactions, getCrops, getLivestock } from "@/lib/data-storage"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, Users, DollarSign, Target } from "lucide-react"

export default function InvestorDashboard() {
  const { user } = useAuth()

  const allUsers = getAllUsers().filter((u) => u.role === "user")
  const allTransactions = getTransactions()
  const allCrops = getCrops()
  const allLivestock = getLivestock()

  const totalInvestment = user?.investment_amount || 0
  const platformGrowth = allUsers.length
  const totalPlatformValue = allTransactions.reduce((sum, t) => sum + t.amount, 0)
  const roi = ((totalPlatformValue - totalInvestment) / totalInvestment) * 100

  const growthData = [
    { month: "Jan", farmers: 5, transactions: 12, value: 150000 },
    { month: "Feb", farmers: 8, transactions: 20, value: 280000 },
    { month: "Mar", farmers: 12, transactions: 35, value: 420000 },
    { month: "Apr", farmers: 15, transactions: 48, value: 580000 },
    { month: "May", farmers: 18, transactions: 62, value: 720000 },
    { month: "Jun", farmers: platformGrowth, transactions: allTransactions.length, value: totalPlatformValue },
  ]

  return (
    <RoleDashboardLayout allowedRoles={["investor"]} title="Investor Dashboard">
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white py-8 px-4 sticky top-0 z-40 shadow-lg">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-2">Investment Analytics Dashboard</h1>
            <p className="text-purple-100">{user?.full_name || "Investor Account"}</p>
            <div className="mt-3">
              <p className="text-sm">
                <strong>Focus:</strong> {user?.investment_focus}
              </p>
              <p className="text-sm">
                <strong>Investment Amount:</strong> RWF {(user?.investment_amount || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <DashboardNav role="investor" />

        <div className="container mx-auto px-4 py-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-2 border-purple-200 bg-white/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Platform Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-700">{platformGrowth}</div>
                <p className="text-xs text-gray-500 mt-1">Active farmers</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-white/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Platform Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-700">
                  {(totalPlatformValue / 1000000).toFixed(1)}M RWF
                </div>
                <p className="text-xs text-gray-500 mt-1">Total transactions</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-white/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> ROI Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${roi >= 0 ? "text-green-700" : "text-red-700"}`}>
                  {roi >= 0 ? "+" : ""}
                  {roi.toFixed(1)}%
                </div>
                <p className="text-xs text-gray-500 mt-1">Return on investment</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 bg-white/80">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Target className="w-4 h-4" /> My Investment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-700">{(totalInvestment / 1000000).toFixed(1)}M RWF</div>
                <p className="text-xs text-gray-500 mt-1">Capital deployed</p>
              </CardContent>
            </Card>
          </div>

          {/* Growth Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle>Platform Growth Trajectory</CardTitle>
                <CardDescription>Active farmers and transaction growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="farmers"
                      stroke="#7c3aed"
                      strokeWidth={2}
                      name="Farmers"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="transactions"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      name="Transactions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200">
              <CardHeader>
                <CardTitle>Economic Value Growth</CardTitle>
                <CardDescription>Total platform economic activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `RWF ${(value / 1000).toFixed(0)}K`} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      fill="#7c3aed"
                      stroke="#6d28d9"
                      fillOpacity={0.3}
                      name="Platform Value"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Investment Summary */}
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle>Investment Summary</CardTitle>
              <CardDescription>Platform performance and investment metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Crops Tracked</p>
                  <p className="text-2xl font-bold text-purple-700">{allCrops.length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Harvested Crops</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {allCrops.filter((c) => c.status === "harvested").length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Livestock Count</p>
                  <p className="text-2xl font-bold text-purple-700">
                    {allLivestock.reduce((sum, l) => sum + l.count, 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Platform Health</p>
                  <p className="text-2xl font-bold text-green-700">Excellent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-600 mt-12">
          <p>© 2025 AgriAssist Rwanda. All rights reserved. Enzo design.</p>
        </footer>
      </div>
    </RoleDashboardLayout>
  )
}
