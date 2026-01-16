"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { getAllUsers, deleteUser, getTransactions } from "@/lib/users-db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, MapPin, Phone, Mail, Wallet, Trash2, TrendingUp, Zap, CheckCircle } from "lucide-react"
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
import { AdminLayout } from "@/components/admin/admin-layout"

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

  if (!user || user.role !== "admin") {
    redirect("/")
  }

  const allUsers = getAllUsers().filter((u) => u.role !== "admin")
  const transactions = getTransactions()
  const dailyTransactions = transactions.filter((t) => new Date(t.date).toDateString() === new Date().toDateString())

  const handleUserCreated = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete)
      setRefreshKey((prev) => prev + 1)
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

  const activeDistricts = new Set(allUsers.map((u) => u.district)).size
  const totalTransactionAmount = dailyTransactions.reduce((sum, t) => sum + t.amount, 0)

  return (
    <AdminLayout>
      <div key={refreshKey} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Farmers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold">{allUsers.length}</span>
              <p className="text-xs text-muted-foreground mt-1">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Active Districts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold">{activeDistricts}</span>
              <p className="text-xs text-muted-foreground mt-1">Covered districts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Daily Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold">{formatCurrency(totalTransactionAmount)} RWF</span>
              <p className="text-xs text-muted-foreground mt-1">Today's total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4" />
                AI Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold">324</span>
              <p className="text-xs text-muted-foreground mt-1">Advisory requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                System Uptime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold">99.9%</span>
              <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage and monitor all farmer accounts</CardDescription>
            </div>
            <CreateUserDialog onUserCreated={handleUserCreated} />
          </CardHeader>
          <CardContent>
            {allUsers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No farmers registered yet. Create the first account above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allUsers.map((farmer) => (
                  <div
                    key={farmer.id}
                    className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{farmer.full_name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {farmer.role || "user"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {farmer.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {farmer.phone_number || "N/A"}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {farmer.district}, {farmer.province}
                          </div>
                          <div className="flex items-center gap-1">
                            <Wallet className="w-3 h-3" />
                            {formatCurrency(farmer.balance || 0)} RWF
                          </div>
                        </div>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(farmer.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground pt-8 border-t">
          <p>© 2025 AgriAssist Rwanda. All rights reserved. Enzo design.</p>
        </footer>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User Account?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All farmer data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  )
}
