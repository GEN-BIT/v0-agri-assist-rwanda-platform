"use client"

import { useAuth } from "@/lib/auth-context"
import { RoleDashboardLayout } from "@/components/dashboard/role-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getAllUsers } from "@/lib/users-db"
import { getMarketPrices, getCrops } from "@/lib/data-storage"
import { MessageCircle, MapPin, Phone, Star, Clock, ShoppingCart } from "lucide-react"
import { useState } from "react"

type NavTab = "marketplace" | "farmers" | "orders" | "payments" | "reports"

export default function BuyerDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<NavTab>("marketplace")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  const allUsers = getAllUsers().filter((u) => u.role === "user")
  const allCrops = getCrops()
  const marketPrices = getMarketPrices()

  const availableCrops = allCrops.filter((c) => c.status === "harvested")
  const filteredCrops = availableCrops.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const navTabs: Array<{ id: NavTab; label: string; icon: string }> = [
    { id: "marketplace", label: "Marketplace", icon: "🛒" },
    { id: "farmers", label: "Farmers", icon: "👨‍🌾" },
    { id: "orders", label: "Orders", icon: "📦" },
    { id: "payments", label: "Payments", icon: "💳" },
    { id: "reports", label: "Reports", icon: "📊" },
  ]

  return (
    <RoleDashboardLayout allowedRoles={["buyer"]} title="Buyer Dashboard">
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AgriAssist Buyer Marketplace</h1>
                <p className="text-sm text-gray-600">{user?.full_name || "Buyer Account"}</p>
              </div>
              <div className="flex gap-2">
                {user?.buyer_products?.map((product) => (
                  <span
                    key={product}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold"
                  >
                    {product}
                  </span>
                ))}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-1 border-b border-gray-200">
              {navTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Marketplace Tab */}
          {activeTab === "marketplace" && (
            <>
              <div className="mb-6">
                <Input
                  placeholder="Search available crops..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
                <p className="text-sm text-gray-600 mt-2">{filteredCrops.length} crops available for purchase</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCrops.map((crop) => {
                  const farmer = allUsers.find((u) => u.id === crop.user_id)
                  const price = marketPrices.find((p) => p.product.toLowerCase() === crop.name.toLowerCase())

                  return (
                    <Card key={crop.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{crop.name}</CardTitle>
                            <CardDescription>From {farmer?.full_name}</CardDescription>
                          </div>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-xs font-semibold">
                            In Stock
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Quantity</p>
                              <p className="font-semibold">
                                {crop.yield_amount} {crop.yield_unit}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Harvest Date</p>
                              <p className="font-semibold">
                                {new Date(crop.actual_harvest_date || "").toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600">Location</p>
                              <p className="font-semibold">{farmer?.district}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Price/Kg</p>
                              <p className="font-semibold">{price?.price_per_unit || "N/A"} RWF</p>
                            </div>
                          </div>

                          <Button className="w-full" size="sm">
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Create Purchase Order
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {filteredCrops.length === 0 && (
                <Card>
                  <CardContent className="py-8">
                    <p className="text-center text-gray-600">No crops matching your search. Try different keywords.</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Farmers Tab */}
          {activeTab === "farmers" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allUsers.slice(0, 12).map((farmer) => {
                const farmerCrops = allCrops.filter((c) => c.user_id === farmer.id && c.status === "harvested").length

                return (
                  <Card key={farmer.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{farmer.full_name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {farmer.district}, {farmer.province}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">4.2</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-sm">
                          <p className="text-gray-600">Farm Type</p>
                          <p className="font-semibold">{farmer.farm_type}</p>
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-600">Crops Available</p>
                          <p className="font-semibold">{farmerCrops}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            <Phone className="w-4 h-4 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" className="flex-1">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <Card>
              <CardHeader>
                <CardTitle>Purchase Orders</CardTitle>
                <CardDescription>Track your orders and deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Order #001 - Tomatoes 100kg</h3>
                      <p className="text-sm text-gray-600">From Jean Baptiste Uwimana</p>
                    </div>
                    <span className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                      <Clock className="w-4 h-4" />
                      In Transit
                    </span>
                  </div>
                  <p className="text-center text-gray-600 py-8">
                    No orders yet. Create your first purchase order from the Marketplace.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Management</CardTitle>
                <CardDescription>MoMo, Bank Transfers, and Invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Payment Methods</h3>
                    <div className="space-y-2 text-sm">
                      <p>✓ Mobile Money (MTN, Airtel)</p>
                      <p>✓ Bank Transfer</p>
                      <p>✓ Credit/Debit Card</p>
                    </div>
                  </div>
                  <p className="text-gray-600">Your payment history and transaction records will appear here.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
                <CardDescription>View your purchase history and spending analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <Button>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Download Purchase History
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-600 mt-12">
          <p>© 2025 AgriAssist Rwanda. All rights reserved. Enzo design.</p>
        </footer>
      </div>
    </RoleDashboardLayout>
  )
}
