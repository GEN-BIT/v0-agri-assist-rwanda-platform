"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Phone,
  Mail,
  Star,
  Search,
  Building2,
  Users,
  User,
  Globe,
  CheckCircle2,
} from "lucide-react"
import { getMarketPrices } from "@/lib/data-storage"
import { EditPriceDialog } from "@/components/market/edit-price-dialog"
import { demoBuyers } from "@/lib/demo-data"
import { RWANDA_CROPS } from "@/lib/rwanda-data"

export default function MarketPage() {
  const { user, loading } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [buyerSearchQuery, setBuyerSearchQuery] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)
  const [showSuggestions, setShowSuggestions] = useState(false)

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

  const marketPrices = getMarketPrices()

  const handlePriceUpdated = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-RW", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffHours < 1) return "Just now"
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString("en-RW", { month: "short", day: "numeric" })
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-success" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-destructive" />
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case "up":
        return "text-success"
      case "down":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getBuyerTypeIcon = (type: string) => {
    switch (type) {
      case "company":
        return <Building2 className="h-4 w-4" />
      case "cooperative":
        return <Users className="h-4 w-4" />
      case "export":
        return <Globe className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const suggestions = searchQuery.trim()
    ? RWANDA_CROPS.filter(
        (crop) =>
          crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          crop.category.toLowerCase().includes(searchQuery.toLowerCase()),
      ).slice(0, 8)
    : []

  const filteredPrices = marketPrices.filter(
    (price) =>
      price.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      price.market_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      price.district.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredBuyers = demoBuyers.filter(
    (buyer) =>
      buyer.name.toLowerCase().includes(buyerSearchQuery.toLowerCase()) ||
      buyer.products_buying.some((p) => p.toLowerCase().includes(buyerSearchQuery.toLowerCase())) ||
      buyer.district.toLowerCase().includes(buyerSearchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background" key={refreshKey}>
      <DashboardHeader />
      <DashboardNav />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Market Access</h2>
          <p className="text-muted-foreground">Compare prices and connect with buyers across Rwanda</p>
        </div>

        <Tabs defaultValue="prices" className="space-y-6">
          <TabsList>
            <TabsTrigger value="prices">Market Prices</TabsTrigger>
            <TabsTrigger value="buyers">Find Buyers</TabsTrigger>
          </TabsList>

          {/* Market Prices Tab */}
          <TabsContent value="prices" className="space-y-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products, markets, or districts..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="pl-10"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                    {suggestions.map((crop, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSearchQuery(crop.name)
                          setShowSuggestions(false)
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{crop.name}</p>
                          <p className="text-xs text-muted-foreground">{crop.category}</p>
                        </div>
                        <p className="text-sm text-primary font-medium">{crop.avgPrice} RWF/Kg</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPrices.map((price) => (
                <Card key={price.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{price.product}</CardTitle>
                        <CardDescription className="text-xs">{price.category}</CardDescription>
                      </div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(price.trend)}
                        {user.role === "admin" && <EditPriceDialog price={price} onPriceUpdated={handlePriceUpdated} />}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-3xl font-bold text-primary">
                        {formatCurrency(price.price_per_unit)} <span className="text-base">RWF</span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">per {price.unit}</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{price.market_location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          {price.district}, {price.province}
                        </span>
                      </div>
                      {(price.sector || price.cell || price.village) && (
                        <div className="text-xs text-muted-foreground">
                          {[price.sector, price.cell, price.village].filter(Boolean).join(", ")}
                        </div>
                      )}
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground">Updated {formatDate(price.last_updated)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Find Buyers Tab */}
          <TabsContent value="buyers" className="space-y-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search buyers, products, or locations..."
                  value={buyerSearchQuery}
                  onChange={(e) => setBuyerSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {filteredBuyers.map((buyer) => (
                <Card key={buyer.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{buyer.name}</CardTitle>
                          {buyer.verified && <CheckCircle2 className="h-5 w-5 text-primary" title="Verified Buyer" />}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            <span className="mr-1">{getBuyerTypeIcon(buyer.type)}</span>
                            {buyer.type}
                          </Badge>
                          {buyer.rating && (
                            <div className="flex items-center gap-1 text-xs">
                              <Star className="h-3 w-3 fill-accent text-accent" />
                              <span className="font-medium">{buyer.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Buying:</p>
                      <div className="flex flex-wrap gap-1">
                        {buyer.products_buying.map((product, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span>
                          {buyer.location}, {buyer.district}
                        </span>
                      </div>
                      {buyer.contact_phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span>{buyer.contact_phone}</span>
                        </div>
                      )}
                      {buyer.contact_email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{buyer.contact_email}</span>
                        </div>
                      )}
                    </div>

                    <Button className="w-full bg-transparent" variant="outline">
                      Contact Buyer
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <footer className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 AgriAssist Rwanda. All rights reserved. Enzo design.
          </p>
        </footer>
      </main>
    </div>
  )
}
