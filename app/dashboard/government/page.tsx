"use client"

import { useAuth } from "@/lib/auth-context"
import { RoleDashboardLayout } from "@/components/dashboard/role-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getAllUsers, getTransactions } from "@/lib/users-db"
import { getCrops, getLivestock } from "@/lib/data-storage"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { AlertTriangle, Download } from "lucide-react"
import { useState } from "react"

type NavItem = "dashboard" | "reports" | "analytics" | "food_security" | "exports"

export default function GovernmentDashboard() {
  const { user } = useAuth()
  const [activeNav, setActiveNav] = useState<NavItem>("dashboard")

  const allUsers = getAllUsers().filter((u) => u.role === "user")
  const allTransactions = getTransactions()
  const allCrops = getCrops()
  const allLivestock = getLivestock()

  const totalFarmers = allUsers.length
  const totalCropProduction = allCrops.filter((c) => c.status === "harvested").length
  const totalLivestockCount = allLivestock.reduce((sum, l) => sum + l.count, 0)

  const farmersByProvince = allUsers.reduce(
    (acc, user) => {
      const existing = acc.find((p) => p.name === user.province)
      if (existing) {
        existing.value += 1
      } else {
        acc.push({ name: user.province, value: 1 })
      }
      return acc
    },
    [] as Array<{ name: string; value: number }>,
  )

  const productionByProvince = allCrops.reduce(
    (acc, crop) => {
      const user = allUsers.find((u) => u.id === crop.user_id)
      if (user?.province) {
        const existing = acc.find((p) => p.province === user.province)
        if (existing) {
          existing.crops += 1
        } else {
          acc.push({ province: user.province, crops: 1 })
        }
      }
      return acc
    },
    [] as Array<{ province: string; crops: number }>,
  )

  const COLORS = ["#2d5016", "#7a9b3a", "#d97706", "#16a34a", "#0ea5e9"]

  const navItems: Array<{ id: NavItem; label: string; icon: string }> = [
    { id: "dashboard", label: "National Dashboard", icon: "📊" },
    { id: "analytics", label: "Crop Analytics", icon: "📈" },
    { id: "food_security", label: "Food Security", icon: "🌾" },
    { id: "reports", label: "Reports", icon: "📋" },
    { id: "exports", label: "Exports", icon: "🚢" },
  ]

  return (
    <RoleDashboardLayout allowedRoles={["government_officer"]} title="Government Officer Dashboard">
      <div className="min-h-screen bg-gray-50 flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-6 sticky top-0 h-screen overflow-y-auto shadow-sm">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900">MINAGRI</h2>
            <p className="text-sm text-gray-600">{user?.designation || "Officer"}</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeNav === item.id
                    ? "bg-green-100 text-green-900 border-l-4 border-green-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-12 pt-6 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-500 mb-4">QUICK ACTIONS</p>
            <Button className="w-full mb-2 justify-start bg-transparent" variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline" size="sm">
              <AlertTriangle className="w-4 h-4 mr-2" />
              View Alerts
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar */}
          <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-40 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">
              {navItems.find((item) => item.id === activeNav)?.label}
            </h1>
            <p className="text-sm text-gray-600">Monitor agriculture nationally and make data-driven decisions</p>
          </div>

          <div className="p-8">
            {activeNav === "dashboard" && (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                  <Card className="border-l-4 border-green-600">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Total Farmers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-700">{totalFarmers}</div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-blue-600">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Harvested Crops</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-700">{totalCropProduction}</div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-orange-600">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Livestock Count</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-orange-700">{totalLivestockCount}</div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-red-600">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">Districts Active</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-red-700">30</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Farmer Distribution by Province</CardTitle>
                      <CardDescription>Number of registered farmers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={farmersByProvince}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {COLORS.map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Production by Province</CardTitle>
                      <CardDescription>Harvested crops count</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={productionByProvince}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="province" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="crops" fill="#2d5016" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Farmers Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Districts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold">District</th>
                            <th className="text-left py-3 px-4 font-semibold">Farmers</th>
                            <th className="text-left py-3 px-4 font-semibold">Crops Harvested</th>
                            <th className="text-left py-3 px-4 font-semibold">Livestock</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.from(new Set(allUsers.map((u) => u.district)))
                            .slice(0, 10)
                            .map((district) => (
                              <tr key={district} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium">{district}</td>
                                <td className="py-3 px-4">{allUsers.filter((u) => u.district === district).length}</td>
                                <td className="py-3 px-4">
                                  {
                                    allCrops.filter(
                                      (c) =>
                                        c.status === "harvested" &&
                                        allUsers.find((u) => u.id === c.user_id)?.district === district,
                                    ).length
                                  }
                                </td>
                                <td className="py-3 px-4">
                                  {allLivestock
                                    .filter((l) => allUsers.find((u) => u.id === l.user_id)?.district === district)
                                    .reduce((sum, l) => sum + l.count, 0)}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {activeNav === "analytics" && (
              <Card>
                <CardHeader>
                  <CardTitle>Crop Analytics</CardTitle>
                  <CardDescription>Production trends and insights by crop type</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Analytics dashboard with detailed crop production metrics and trends.</p>
                </CardContent>
              </Card>
            )}

            {activeNav === "food_security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Food Security Monitoring</CardTitle>
                  <CardDescription>Climate risk alerts and production forecasts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Early warning system for food security threats and risk management.</p>
                </CardContent>
              </Card>
            )}

            {activeNav === "reports" && (
              <Card>
                <CardHeader>
                  <CardTitle>Reports & Analytics</CardTitle>
                  <CardDescription>Monthly and yearly summaries with policy impact analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="mb-4">
                    <Download className="w-4 h-4 mr-2" />
                    Download Monthly Report
                  </Button>
                  <p className="text-gray-600">Downloadable PDF reports with comprehensive agricultural data.</p>
                </CardContent>
              </Card>
            )}

            {activeNav === "exports" && (
              <Card>
                <CardHeader>
                  <CardTitle>Exports Tracking</CardTitle>
                  <CardDescription>Monitor agricultural exports and market trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Track export data, market prices, and international buyer connections.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Footer */}
          <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-600 mt-12">
            <p>© 2025 AgriAssist Rwanda. All rights reserved. Enzo design.</p>
          </footer>
        </div>
      </div>
    </RoleDashboardLayout>
  )
}
