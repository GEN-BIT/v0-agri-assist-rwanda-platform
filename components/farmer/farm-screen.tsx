"use client"

import { useState } from "react"
import type { User } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"
import { getCrops, getLivestock, getFarmInputs, deleteCrop, deleteLivestock, deleteFarmInput } from "@/lib/data-storage"
import { AddCropDialog } from "@/components/farm/add-crop-dialog"
import { AddLivestockDialog } from "@/components/farm/add-livestock-dialog"
import { AddInputDialog } from "@/components/farm/add-input-dialog"

interface FarmScreenProps {
  user: User
  refreshKey?: number
  onRefresh?: () => void
}

export function FarmScreen({ user, refreshKey = 0, onRefresh }: FarmScreenProps) {
  const [activeTab, setActiveTab] = useState("crops")
  const crops = getCrops(user.id)
  const livestock = getLivestock(user.id)
  const farmInputs = getFarmInputs(user.id)

  const handleDelete = (type: "crop" | "livestock" | "input", id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      if (type === "crop") deleteCrop(id)
      else if (type === "livestock") deleteLivestock(id)
      else deleteFarmInput(id)
      onRefresh?.()
    }
  }

  return (
    <div className="pb-24 px-4 pt-4 space-y-4 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">My Farm</CardTitle>
          <CardDescription>Farm size: {user.farm_size} hectares</CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="crops">Crops</TabsTrigger>
          <TabsTrigger value="livestock">Livestock</TabsTrigger>
          <TabsTrigger value="inputs">Inputs</TabsTrigger>
        </TabsList>

        <TabsContent value="crops" className="space-y-3">
          {crops.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">No crops added yet</p>
                <AddCropDialog onCropAdded={onRefresh}>
                  <Button size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Crop
                  </Button>
                </AddCropDialog>
              </CardContent>
            </Card>
          ) : (
            <>
              {crops.map((crop) => (
                <Card key={crop.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-sm">{crop.name}</p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {crop.status}
                        </Badge>
                      </div>
                      <button
                        onClick={() => handleDelete("crop", crop.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Area: {crop.area} ha</p>
                      <p>Planted: {crop.planting_date}</p>
                      {crop.expected_harvest_date && <p>Expected: {crop.expected_harvest_date}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
              <AddCropDialog onCropAdded={onRefresh}>
                <Button className="w-full bg-transparent" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Crop
                </Button>
              </AddCropDialog>
            </>
          )}
        </TabsContent>

        <TabsContent value="livestock" className="space-y-3">
          {livestock.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">No livestock added yet</p>
                <AddLivestockDialog onLivestockAdded={onRefresh}>
                  <Button size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Livestock
                  </Button>
                </AddLivestockDialog>
              </CardContent>
            </Card>
          ) : (
            <>
              {livestock.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-sm">{item.type}</p>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {item.health_status}
                        </Badge>
                      </div>
                      <button
                        onClick={() => handleDelete("livestock", item.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Count: {item.count}</p>
                      <p>Purpose: {item.purpose}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <AddLivestockDialog onLivestockAdded={onRefresh}>
                <Button className="w-full bg-transparent" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add More Livestock
                </Button>
              </AddLivestockDialog>
            </>
          )}
        </TabsContent>

        <TabsContent value="inputs" className="space-y-3">
          {farmInputs.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">No inputs recorded yet</p>
                <AddInputDialog onInputAdded={onRefresh}>
                  <Button size="sm" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Record Input
                  </Button>
                </AddInputDialog>
              </CardContent>
            </Card>
          ) : (
            <>
              {farmInputs.map((input) => (
                <Card key={input.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-sm">{input.name}</p>
                        <p className="text-xs text-muted-foreground">{input.type}</p>
                      </div>
                      <button
                        onClick={() => handleDelete("input", input.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>
                        Qty: {input.quantity} {input.unit}
                      </p>
                      <p>Cost: {input.cost.toLocaleString()} RWF</p>
                      {input.applied_to && <p>Applied to: {input.applied_to}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
              <AddInputDialog onInputAdded={onRefresh}>
                <Button className="w-full bg-transparent" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Record Input
                </Button>
              </AddInputDialog>
            </>
          )}
        </TabsContent>
      </Tabs>

      <footer className="text-center text-xs text-muted-foreground pb-4">
        © 2025 AgriAssist Rwanda. All rights reserved. Enzo design.
      </footer>
    </div>
  )
}
