"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addUser, emailExists } from "@/lib/users-db"
import { RWANDA_PROVINCES, DISTRICTS_BY_PROVINCE } from "@/types"

interface BuyerRegistrationFormProps {
  onSuccess: () => void
}

export function BuyerRegistrationForm({ onSuccess }: BuyerRegistrationFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    company_name: "",
    buyer_type: "individual",
    phone_number: "",
    province: "",
    district: "",
    buyer_products: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

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
        phone_number: formData.phone_number,
        province: formData.province,
        district: formData.district,
        buyer_type: formData.buyer_type,
        buyer_products: formData.buyer_products.split(",").map((p) => p.trim()),
        role: "buyer",
        balance: 0,
      })

      onSuccess()
    } catch (err) {
      setError("Failed to create buyer account")
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
            placeholder="Buyer Name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company_name">Company Name</Label>
          <Input
            id="company_name"
            placeholder="Company Name"
            value={formData.company_name}
            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="buyer@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
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

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="buyer_type">Buyer Type *</Label>
          <Select
            value={formData.buyer_type}
            onValueChange={(value) => setFormData({ ...formData, buyer_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual Buyer</SelectItem>
              <SelectItem value="cooperative">Cooperative</SelectItem>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="export">Export Company</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+250788123456"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            required
          />
        </div>
      </div>

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

      <div className="space-y-2">
        <Label htmlFor="products">Products (comma-separated) *</Label>
        <Input
          id="products"
          placeholder="Maize, Beans, Tomatoes"
          value={formData.buyer_products}
          onChange={(e) => setFormData({ ...formData, buyer_products: e.target.value })}
          required
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating Buyer Account..." : "Create Buyer Account"}
      </Button>
    </form>
  )
}
