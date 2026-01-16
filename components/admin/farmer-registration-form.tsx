"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addUser, emailExists } from "@/lib/users-db"
import { RWANDA_PROVINCES, DISTRICTS_BY_PROVINCE, FARM_TYPES } from "@/types"

interface FarmerRegistrationFormProps {
  onSuccess: () => void
}

export function FarmerRegistrationForm({ onSuccess }: FarmerRegistrationFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    id_card_number: "",
    phone_number: "",
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
    farm_size: "",
    farm_type: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!/^\d{16}$/.test(formData.id_card_number)) {
      setError("ID card number must be exactly 16 digits")
      return
    }

    if (emailExists(formData.email)) {
      setError("This email is already registered")
      return
    }

    setLoading(true)

    try {
      addUser({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        id_card_number: formData.id_card_number,
        phone_number: formData.phone_number,
        province: formData.province,
        district: formData.district,
        sector: formData.sector,
        cell: formData.cell,
        village: formData.village,
        farm_size: formData.farm_size ? Number.parseFloat(formData.farm_size) : undefined,
        farm_type: formData.farm_type,
        role: "user",
        balance: 0,
      })

      setFormData({
        email: "",
        password: "",
        full_name: "",
        id_card_number: "",
        phone_number: "",
        province: "",
        district: "",
        sector: "",
        cell: "",
        village: "",
        farm_size: "",
        farm_type: "",
      })
      onSuccess()
    } catch (err) {
      setError("Failed to create farmer account")
    } finally {
      setLoading(false)
    }
  }

  const districts = formData.province ? DISTRICTS_BY_PROVINCE[formData.province] || [] : []

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            placeholder="Jean Baptiste"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="farmer@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="id_card">ID Card Number *</Label>
          <Input
            id="id_card"
            placeholder="1234567890123456"
            value={formData.id_card_number}
            maxLength={16}
            onChange={(e) => setFormData({ ...formData, id_card_number: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+250788123456"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3">Location Details</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="province">Province *</Label>
            <Select
              value={formData.province}
              onValueChange={(value) => setFormData({ ...formData, province: value, district: "" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                {RWANDA_PROVINCES.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
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
              <SelectTrigger>
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="sector">Sector</Label>
            <Input
              id="sector"
              placeholder="Sector name"
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cell">Cell</Label>
            <Input
              id="cell"
              placeholder="Cell name"
              value={formData.cell}
              onChange={(e) => setFormData({ ...formData, cell: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="village">Village</Label>
            <Input
              id="village"
              placeholder="Village name"
              value={formData.village}
              onChange={(e) => setFormData({ ...formData, village: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold mb-3">Farm Details</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="farm_type">Farm Type *</Label>
            <Select
              value={formData.farm_type}
              onValueChange={(value) => setFormData({ ...formData, farm_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select farm type" />
              </SelectTrigger>
              <SelectContent>
                {FARM_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="farm_size">Farm Size (hectares)</Label>
            <Input
              id="farm_size"
              type="number"
              step="0.1"
              placeholder="5.0"
              value={formData.farm_size}
              onChange={(e) => setFormData({ ...formData, farm_size: e.target.value })}
            />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating Farmer Account..." : "Create Farmer Account"}
      </Button>
    </form>
  )
}
