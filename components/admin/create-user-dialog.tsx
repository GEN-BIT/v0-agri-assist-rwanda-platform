"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UserPlus } from "lucide-react"
import { FarmerRegistrationForm } from "./farmer-registration-form"
import { BuyerRegistrationForm } from "./buyer-registration-form"
import { GovernmentRegistrationForm } from "./government-registration-form"
import { InvestorRegistrationForm } from "./investor-registration-form"

interface CreateUserDialogProps {
  onUserCreated: () => void
}

type UserRole = "farmer" | "buyer" | "government" | "investor" | null

export function CreateUserDialog({ onUserCreated }: CreateUserDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>(null)

  const handleUserCreated = () => {
    setSelectedRole(null)
    setOpen(false)
    onUserCreated()
  }

  const roleOptions = [
    { value: "farmer", label: "Regular Farmer", icon: "🌾" },
    { value: "buyer", label: "Buyer", icon: "🛒" },
    { value: "government", label: "Government Officer", icon: "🏛️" },
    { value: "investor", label: "Investor", icon: "💰" },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Create New User
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Account</DialogTitle>
          <DialogDescription>
            {selectedRole
              ? `Create a new ${roleOptions.find((r) => r.value === selectedRole)?.label} account`
              : "Select the type of account to create"}
          </DialogDescription>
        </DialogHeader>

        {!selectedRole ? (
          <div className="grid grid-cols-2 gap-4 py-6">
            {roleOptions.map((role) => (
              <button
                key={role.value}
                onClick={() => setSelectedRole(role.value as UserRole)}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition-all text-center"
              >
                <div className="text-4xl mb-2">{role.icon}</div>
                <p className="font-semibold text-gray-900">{role.label}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="py-6">
            {selectedRole === "farmer" && <FarmerRegistrationForm onSuccess={handleUserCreated} />}
            {selectedRole === "buyer" && <BuyerRegistrationForm onSuccess={handleUserCreated} />}
            {selectedRole === "government" && <GovernmentRegistrationForm onSuccess={handleUserCreated} />}
            {selectedRole === "investor" && <InvestorRegistrationForm onSuccess={handleUserCreated} />}
            <Button type="button" variant="outline" onClick={() => setSelectedRole(null)} className="w-full mt-4">
              Back to Role Selection
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
