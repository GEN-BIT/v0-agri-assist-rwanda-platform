"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Search, MapPin, Phone, Star } from "lucide-react"
import { RWANDA_CROPS } from "@/lib/rwanda-data"
import { demoBuyers } from "@/lib/demo-data"

export function MarketScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showCrops, setShowCrops] = useState(true)

  const filteredCrops = RWANDA_CROPS.filter(
    (crop) =>
      crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredBuyers = demoBuyers.filter((buyer) => buyer.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="pb-24 px-4 pt-4 space-y-4 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Market & Buyers
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search crops or buyers..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Toggle Tabs */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={showCrops ? "default" : "outline"}
          onClick={() => setShowCrops(true)}
          className="flex-1"
        >
          Crop Prices
        </Button>
        <Button
          size="sm"
          variant={!showCrops ? "default" : "outline"}
          onClick={() => setShowCrops(false)}
          className="flex-1"
        >
          Buyers
        </Button>
      </div>

      {/* Crop Prices */}
      {showCrops && (
        <div className="space-y-3">
          {filteredCrops.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-sm text-muted-foreground">No crops found</CardContent>
            </Card>
          ) : (
            filteredCrops.map((crop) => (
              <Card key={crop.name}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-sm">{crop.name}</p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {crop.category}
                      </Badge>
                    </div>
                    <p className="font-bold text-primary">{crop.avgPrice} RWF/kg</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Buyers */}
      {!showCrops && (
        <div className="space-y-3">
          {filteredBuyers.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-sm text-muted-foreground">No buyers found</CardContent>
            </Card>
          ) : (
            filteredBuyers.map((buyer) => (
              <Card key={buyer.id}>
                <CardContent className="pt-6 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{buyer.name}</p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {buyer.type}
                      </Badge>
                      {buyer.verified && (
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">{buyer.rating}/5</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {buyer.location}, {buyer.district}
                    </p>
                    {buyer.contact_phone && (
                      <p className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {buyer.contact_phone}
                      </p>
                    )}
                    <p className="text-xs mt-2">Buying: {buyer.products_buying.join(", ")}</p>
                  </div>
                  <Button size="sm" className="w-full mt-2">
                    Contact Buyer
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      <footer className="text-center text-xs text-muted-foreground pb-4">
        © 2025 AgriAssist Rwanda. All rights reserved. Enzo design.
      </footer>
    </div>
  )
}
