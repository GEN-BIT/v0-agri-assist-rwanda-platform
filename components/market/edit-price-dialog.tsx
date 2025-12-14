"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil } from "lucide-react"
import { saveMarketPrice } from "@/lib/data-storage"
import type { MarketPrice } from "@/types"
import { RWANDA_PROVINCES, DISTRICTS_BY_PROVINCE } from "@/types"

interface EditPriceDialogProps {
  price: MarketPrice
  onPriceUpdated?: () => void
}

export function EditPriceDialog({ price, onPriceUpdated }: EditPriceDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    price_per_unit: price.price_per_unit.toString(),
    province: price.province,
    district: price.district,
    market_location: price.market_location,
    sector: price.sector || "",
    cell: price.cell || "",
    village: price.village || "",
    trend: price.trend || "stable",
  })

  const districts = formData.province ? DISTRICTS_BY_PROVINCE[formData.province] || [] : []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedPrice: MarketPrice = {
      ...price,
      price_per_unit: Number.parseFloat(formData.price_per_unit),
      province: formData.province,
      district: formData.district,
      market_location: formData.market_location,
      sector: formData.sector || undefined,
      cell: formData.cell || undefined,
      village: formData.village || undefined,
      trend: formData.trend as "up" | "down" | "stable" | undefined,
      last_updated: new Date().toISOString(),
    }

    saveMarketPrice(updatedPrice)
    setOpen(false)
    onPriceUpdated?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Market Price</DialogTitle>
          <DialogDescription>
            Update price for {price.product} in {price.market_location}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price per {price.unit} (RWF) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price_per_unit}
              onChange={(e) => setFormData({ ...formData, price_per_unit: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="province">Province *</Label>
            <Select
              value={formData.province}
              onValueChange={(value) => setFormData({ ...formData, province: value, district: "" })}
            >
              <SelectTrigger id="province">
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                {RWANDA_PROVINCES.map((prov) => (
                  <SelectItem key={prov} value={prov}>
                    {prov}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="district">District *</Label>
            <Select
              value={formData.district}
              onValueChange={(value) => setFormData({ ...formData, district: value })}
              disabled={!formData.province}
            >
              <SelectTrigger id="district">
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((dist) => (
                  <SelectItem key={dist} value={dist}>
                    {dist}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sector">Sector</Label>
            <Input
              id="sector"
              placeholder="e.g., Kimihurura"
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cell">Cell</Label>
            <Input
              id="cell"
              placeholder="e.g., Rugenge"
              value={formData.cell}
              onChange={(e) => setFormData({ ...formData, cell: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="village">Village</Label>
            <Input
              id="village"
              placeholder="e.g., Nyamirambo"
              value={formData.village}
              onChange={(e) => setFormData({ ...formData, village: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="market_location">Market Location *</Label>
            <Input
              id="market_location"
              placeholder="e.g., Kimironko Market"
              value={formData.market_location}
              onChange={(e) => setFormData({ ...formData, market_location: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trend">Price Trend</Label>
            <Select value={formData.trend} onValueChange={(value) => setFormData({ ...formData, trend: value })}>
              <SelectTrigger id="trend">
                <SelectValue placeholder="Select trend" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="up">Up</SelectItem>
                <SelectItem value="down">Down</SelectItem>
                <SelectItem value="stable">Stable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
