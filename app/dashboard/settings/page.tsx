"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { User, Lock, Bell, Info, Upload, Camera } from "lucide-react"
import { RWANDA_PROVINCES, DISTRICTS_BY_PROVINCE, FARM_TYPES } from "@/types"

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [profilePicture, setProfilePicture] = useState(user?.profile_picture || "")
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    phone_number: user?.phone_number || "",
    province: user?.province || "",
    district: user?.district || "",
    sector: user?.sector || "",
    cell: user?.cell || "",
    village: user?.village || "",
    farm_size: user?.farm_size?.toString() || "",
    farm_type: user?.farm_type || "",
  })

  const [notifications, setNotifications] = useState({
    marketPriceAlerts: true,
    harvestReminders: true,
    financialReports: true,
    newBuyerOpportunities: true,
  })

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicture(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert("Passwords do not match")
      return
    }
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setPasswordData({
      current_password: "",
      new_password: "",
      confirm_password: "",
    })
    setIsSaving(false)
  }

  const districts = profileData.province ? DISTRICTS_BY_PROVINCE[profileData.province] || [] : []

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardNav />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Settings</h2>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="about">
              <Info className="h-4 w-4 mr-2" />
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal and farm details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      {profilePicture ? (
                        <img
                          src={profilePicture || "/placeholder.svg"}
                          alt="Profile"
                          className="w-24 h-24 rounded-full object-cover border-4 border-border"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-4 border-border">
                          <User className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max 5MB.</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name *</Label>
                        <Input
                          id="full_name"
                          value={profileData.full_name}
                          onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone_number">Phone Number</Label>
                        <Input
                          id="phone_number"
                          type="tel"
                          placeholder="+250788123456"
                          value={profileData.phone_number}
                          onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="border-t border-border pt-4">
                      <h3 className="font-semibold mb-3">Location Details</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="province">Province</Label>
                          <Select
                            value={profileData.province}
                            onValueChange={(value) => setProfileData({ ...profileData, province: value, district: "" })}
                          >
                            <SelectTrigger id="province">
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
                          <Label htmlFor="district">District</Label>
                          <Select
                            value={profileData.district}
                            onValueChange={(value) => setProfileData({ ...profileData, district: value })}
                            disabled={!profileData.province}
                          >
                            <SelectTrigger id="district">
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
                            placeholder="Enter sector"
                            value={profileData.sector}
                            onChange={(e) => setProfileData({ ...profileData, sector: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cell">Cell</Label>
                          <Input
                            id="cell"
                            placeholder="Enter cell"
                            value={profileData.cell}
                            onChange={(e) => setProfileData({ ...profileData, cell: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="village">Village</Label>
                          <Input
                            id="village"
                            placeholder="Enter village"
                            value={profileData.village}
                            onChange={(e) => setProfileData({ ...profileData, village: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="farm_type">Farm Type</Label>
                        <Select
                          value={profileData.farm_type}
                          onValueChange={(value) => setProfileData({ ...profileData, farm_type: value })}
                        >
                          <SelectTrigger id="farm_type">
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
                          value={profileData.farm_size}
                          onChange={(e) => setProfileData({ ...profileData, farm_size: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current_password">Current Password *</Label>
                    <Input
                      id="current_password"
                      type="password"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new_password">New Password *</Label>
                    <Input
                      id="new_password"
                      type="password"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirm New Password *</Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive updates and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Market Price Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified when prices change significantly</p>
                  </div>
                  <Switch
                    checked={notifications.marketPriceAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, marketPriceAlerts: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Harvest Reminders</p>
                    <p className="text-sm text-muted-foreground">Receive alerts for upcoming harvest dates</p>
                  </div>
                  <Switch
                    checked={notifications.harvestReminders}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, harvestReminders: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Financial Reports</p>
                    <p className="text-sm text-muted-foreground">Monthly summary of your farm finances</p>
                  </div>
                  <Switch
                    checked={notifications.financialReports}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, financialReports: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">New Buyer Opportunities</p>
                    <p className="text-sm text-muted-foreground">Alerts for buyers looking for your products</p>
                  </div>
                  <Switch
                    checked={notifications.newBuyerOpportunities}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, newBuyerOpportunities: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About AgriAssist Rwanda</CardTitle>
                <CardDescription>Platform information and support</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Version</h3>
                  <p className="text-muted-foreground">AgriAssist Rwanda v1.0.0</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    AgriAssist Rwanda is an all-in-one digital platform created to support farmers across Rwanda's five
                    provinces and thirty districts. We provide tools for farm management, financial tracking, and market
                    access to help farmers improve productivity and profitability.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Support</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">Need help? Contact our support team:</p>
                    <p className="text-muted-foreground">Email: support@agriassist.rw</p>
                    <p className="text-muted-foreground">Phone: +250 788 000 000</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Coverage</h3>
                  <p className="text-muted-foreground text-sm">
                    Serving farmers across all 5 provinces and 30 districts of Rwanda
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    © 2025 AgriAssist Rwanda. All rights reserved. Enzo design.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <footer className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 AgriAssist Rwanda. All rights reserved. Enzo design.
          </p>
        </footer>
      </main>
    </div>
  )
}
