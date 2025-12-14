"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddCropDialog } from "@/components/farm/add-crop-dialog"
import { AddLivestockDialog } from "@/components/farm/add-livestock-dialog"
import { AddInputDialog } from "@/components/farm/add-input-dialog"
import { getCrops, getLivestock, getFarmInputs, deleteCrop, deleteLivestock, deleteFarmInput } from "@/lib/data-storage"
import { Leaf, Calendar, TrendingUp, MoreVertical, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function FarmPage() {
  const { user, loading } = useAuth()
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

  const crops = getCrops(user.id)
  const livestock = getLivestock(user.id)
  const farmInputs = getFarmInputs(user.id)

  const handleDelete = (type: "crop" | "livestock" | "input", id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      if (type === "crop") deleteCrop(id)
      else if (type === "livestock") deleteLivestock(id)
      else deleteFarmInput(id)
      setRefreshKey((prev) => prev + 1)
    }
  }

  const handleItemAdded = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "growing":
        return "bg-secondary/10 text-secondary border-secondary/20"
      case "harvested":
        return "bg-success/10 text-success border-success/20"
      case "planted":
        return "bg-primary/10 text-primary border-primary/20"
      case "failed":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-success/10 text-success border-success/20"
      case "vaccinated":
        return "bg-primary/10 text-primary border-primary/20"
      case "sick":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "quarantine":
        return "bg-accent/10 text-accent border-accent/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-RW", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-RW", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-background" key={refreshKey}>
      <DashboardHeader />
      <DashboardNav />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Farm Management</h2>
          <p className="text-muted-foreground">Track and manage your crops, livestock, and farm inputs</p>
        </div>

        <Tabs defaultValue="crops" className="space-y-6">
          <TabsList>
            <TabsTrigger value="crops">Crops</TabsTrigger>
            <TabsTrigger value="livestock">Livestock</TabsTrigger>
            <TabsTrigger value="inputs">Farm Inputs</TabsTrigger>
          </TabsList>

          {/* Crops Tab */}
          <TabsContent value="crops" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">Your Crops</h3>
                <p className="text-sm text-muted-foreground">{crops.length} crops recorded</p>
              </div>
              <AddCropDialog onCropAdded={handleItemAdded} />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {crops.map((crop) => (
                <Card key={crop.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                          <Leaf className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{crop.name}</CardTitle>
                          {crop.variety && <CardDescription className="text-xs">{crop.variety}</CardDescription>}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDelete("crop", crop.id)} className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Area</span>
                      <span className="font-medium">{crop.area} ha</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <Badge variant="outline" className={getStatusColor(crop.status)}>
                        {crop.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Planted:</span>
                      <span>{formatDate(crop.planting_date)}</span>
                    </div>
                    {crop.expected_harvest_date && (
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Harvest:</span>
                        <span>{formatDate(crop.expected_harvest_date)}</span>
                      </div>
                    )}
                    {crop.yield_amount && (
                      <div className="pt-2 border-t border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Yield</span>
                          <span className="font-medium text-success">
                            {crop.yield_amount} {crop.yield_unit}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Livestock Tab */}
          <TabsContent value="livestock" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">Your Livestock</h3>
                <p className="text-sm text-muted-foreground">{livestock.length} livestock groups</p>
              </div>
              <AddLivestockDialog onLivestockAdded={handleItemAdded} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {livestock.map((animal) => (
                <Card key={animal.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{animal.type}</CardTitle>
                        {animal.breed && <CardDescription>{animal.breed}</CardDescription>}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleDelete("livestock", animal.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Count</span>
                      <span className="text-2xl font-bold">{animal.count}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Purpose</span>
                      <span className="text-sm font-medium">{animal.purpose}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Health</span>
                      <Badge variant="outline" className={getHealthStatusColor(animal.health_status)}>
                        {animal.health_status}
                      </Badge>
                    </div>
                    <div className="pt-2 border-t border-border text-sm text-muted-foreground">
                      Acquired: {formatDate(animal.acquisition_date)}
                    </div>
                    {animal.notes && (
                      <div className="pt-2 border-t border-border">
                        <p className="text-sm text-muted-foreground">{animal.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Farm Inputs Tab */}
          <TabsContent value="inputs" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">Farm Inputs</h3>
                <p className="text-sm text-muted-foreground">Track fertilizers, pesticides, and other inputs</p>
              </div>
              <AddInputDialog onInputAdded={handleItemAdded} />
            </div>

            <Card>
              <CardContent className="p-0">
                {farmInputs.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <p>No farm inputs recorded yet. Add your first input above.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {farmInputs.map((input) => (
                      <div
                        key={input.id}
                        className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{input.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {input.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>
                              {input.quantity} {input.unit}
                            </span>
                            {input.applied_to && (
                              <>
                                <span>•</span>
                                <span>Applied to {input.applied_to}</span>
                              </>
                            )}
                            <span>•</span>
                            <span>{formatDate(input.application_date)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(input.cost)} RWF</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete("input", input.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 AgriAssist Rwanda. All rights reserved. Enzo design.
          </p>
        </footer>
      </main>
    </div>
  )
}
