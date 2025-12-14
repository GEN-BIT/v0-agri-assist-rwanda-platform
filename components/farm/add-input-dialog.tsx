"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
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
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { saveFarmInput } from "@/lib/data-storage"
import type { FarmInput } from "@/types"

interface AddInputDialogProps {
  onInputAdded?: () => void
}

export function AddInputDialog({ onInputAdded }: AddInputDialogProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    quantity: "",
    unit: "",
    cost: "",
    application_date: "",
    applied_to: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newInput: FarmInput = {
      id: Date.now().toString(),
      user_id: user?.id || "1",
      type: formData.type,
      name: formData.name,
      quantity: Number.parseFloat(formData.quantity),
      unit: formData.unit,
      cost: Number.parseFloat(formData.cost),
      application_date: formData.application_date,
      applied_to: formData.applied_to,
      notes: formData.notes || undefined,
      created_at: new Date().toISOString(),
    }

    saveFarmInput(newInput)
    setOpen(false)
    setFormData({
      type: "",
      name: "",
      quantity: "",
      unit: "",
      cost: "",
      application_date: "",
      applied_to: "",
      notes: "",
    })
    onInputAdded?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Record Input
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Farm Input</DialogTitle>
          <DialogDescription>Add fertilizer, pesticide, seed, or other farm input</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })} required>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fertilizer">Fertilizer</SelectItem>
                <SelectItem value="pesticide">Pesticide</SelectItem>
                <SelectItem value="seed">Seed</SelectItem>
                <SelectItem value="herbicide">Herbicide</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="e.g., NPK 17-17-17"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                placeholder="50"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Input
                id="unit"
                placeholder="kg, liters"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">Cost (RWF) *</Label>
            <Input
              id="cost"
              type="number"
              placeholder="75000"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="application_date">Application Date *</Label>
            <Input
              id="application_date"
              type="date"
              value={formData.application_date}
              onChange={(e) => setFormData({ ...formData, application_date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="applied_to">Applied To</Label>
            <Input
              id="applied_to"
              placeholder="e.g., Maize, Beans"
              value={formData.applied_to}
              onChange={(e) => setFormData({ ...formData, applied_to: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full">
            Add Input
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
