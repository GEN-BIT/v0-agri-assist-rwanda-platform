"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { getAllUsers, deleteUser } from "@/lib/users-db"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Users, MapPin, Phone, Mail, Calendar, Leaf, Award as IdCard, Wallet, Trash2 } from "lucide-react"
import { CreateUserDialog } from "@/components/admin/create-user-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function AdminPage() {
  const { user, loading } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)

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

  if (user.role !== "admin") {
    redirect("/dashboard")
  }

  const allUsers = getAllUsers().filter((u) => u.role !== "admin")

  const handleUserCreated = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (userToDelete) {
      const success = deleteUser(userToDelete)
      if (success) {
        setRefreshKey((prev) => prev + 1)
      }
    }
    setDeleteDialogOpen(false)
    setUserToDelete(null)
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
        {/* Admin Header */}
        <div className="mb-8 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Admin Panel</h2>
              <p className="text-muted-foreground">Manage all farmer accounts across Rwanda</p>
            </div>
          </div>
          <CreateUserDialog onUserCreated={handleUserCreated} />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{allUsers.length}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Farm Area</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-success" />
                <span className="text-2xl font-bold">
                  {allUsers.reduce((sum, u) => sum + (u.farm_size || 0), 0)} ha
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Provinces</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-secondary" />
                <span className="text-2xl font-bold">5</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Districts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-accent" />
                <span className="text-2xl font-bold">30</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>All Registered Farmers</CardTitle>
            <CardDescription>Complete list of farmers using AgriAssist Rwanda</CardDescription>
          </CardHeader>
          <CardContent>
            {allUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No farmers registered yet. Create the first account above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {allUsers.map((farmer) => (
                  <div
                    key={farmer.id}
                    className="p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
                  >
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Basic Info */}
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{farmer.full_name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <Mail className="h-3 w-3" />
                              {farmer.email}
                            </p>
                          </div>
                          <Badge variant="outline">{farmer.role || "user"}</Badge>
                        </div>
                        {farmer.phone_number && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {farmer.phone_number}
                          </p>
                        )}
                      </div>

                      <div>
                        <div className="space-y-2">
                          {farmer.id_card_number && (
                            <div className="flex items-center gap-2">
                              <IdCard className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-mono">{farmer.id_card_number}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              <span className="font-medium">Balance:</span> {formatCurrency(farmer.balance || 0)} RWF
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Location & Farm Info */}
                      <div>
                        <div className="space-y-2">
                          {farmer.province && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {farmer.district}, {farmer.province}
                              </span>
                            </div>
                          )}
                          {(farmer.sector || farmer.cell || farmer.village) && (
                            <div className="text-xs text-muted-foreground ml-6">
                              {[farmer.sector, farmer.cell, farmer.village].filter(Boolean).join(", ")}
                            </div>
                          )}
                          {farmer.farm_type && (
                            <div className="flex items-center gap-2">
                              <Leaf className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{farmer.farm_type}</span>
                            </div>
                          )}
                          {farmer.farm_size && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Farm Size:</span>
                              <Badge variant="secondary">{farmer.farm_size} hectares</Badge>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Registration Date & Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Registered</p>
                            <p className="text-sm font-medium">
                              {new Date(farmer.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(farmer.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 AgriAssist Rwanda. All rights reserved. Enzo design.
          </p>
        </footer>
      </main>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
