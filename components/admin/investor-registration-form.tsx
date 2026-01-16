"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addUser, emailExists } from "@/lib/users-db"

interface InvestorRegistrationFormProps {
  onSuccess: () => void
}

export function InvestorRegistrationForm({ onSuccess }: InvestorRegistrationFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    company_name: "",
    phone_number: "",
    investment_amount: "",
    investment_focus: "smallholder_support",
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
        investment_amount: formData.investment_amount ? Number.parseInt(formData.investment_amount) : 0,
        investment_focus: formData.investment_focus,
        role: "investor",
        balance: 0,
      })

      onSuccess()
    } catch (err) {
      setError("Failed to create investor account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            placeholder="Investor Name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company_name">Organization/Company Name</Label>
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
            placeholder="investor@example.com"
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
        <div className="space-y-2">
          <Label htmlFor="investment">Investment Amount (RWF) *</Label>
          <Input
            id="investment"
            type="number"
            placeholder="1000000"
            value={formData.investment_amount}
            onChange={(e) => setFormData({ ...formData, investment_amount: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="focus">Investment Focus *</Label>
        <Select
          value={formData.investment_focus}
          onValueChange={(value) => setFormData({ ...formData, investment_focus: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="smallholder_support">Smallholder Support</SelectItem>
            <SelectItem value="technology">Agricultural Technology</SelectItem>
            <SelectItem value="market_access">Market Access</SelectItem>
            <SelectItem value="climate_resilience">Climate Resilience</SelectItem>
            <SelectItem value="value_addition">Value Addition</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating Account..." : "Create Investor Account"}
      </Button>
    </form>
  )
}
