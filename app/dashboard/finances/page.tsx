"use client"

import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddTransactionDialog } from "@/components/finances/add-transaction-dialog"
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { getTransactions } from "@/lib/data-storage"

export default function FinancesPage() {
  const { user, loading } = useAuth()

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

  const userTransactions = getTransactions(user.id)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-RW", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-RW", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const totalIncome = userTransactions.filter((t) => t.type === "income").reduce((acc, t) => acc + t.amount, 0)
  const totalExpenses = userTransactions.filter((t) => t.type === "expense").reduce((acc, t) => acc + t.amount, 0)
  const netProfit = totalIncome - totalExpenses

  const incomeTransactions = userTransactions
    .filter((t) => t.type === "income")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const expenseTransactions = userTransactions
    .filter((t) => t.type === "expense")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const allTransactions = [...userTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardNav />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Financial Management</h2>
            <p className="text-muted-foreground">Track your farm income, expenses, and profitability</p>
          </div>
          <AddTransactionDialog />
        </div>

        {/* Financial Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
              </div>
              <p className="text-3xl font-bold text-success">{formatCurrency(totalIncome)} RWF</p>
              <p className="text-xs text-muted-foreground mt-2">{incomeTransactions.length} transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-destructive" />
                </div>
              </div>
              <p className="text-3xl font-bold text-destructive">{formatCurrency(totalExpenses)} RWF</p>
              <p className="text-xs text-muted-foreground mt-2">{expenseTransactions.length} transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className={`text-3xl font-bold ${netProfit >= 0 ? "text-success" : "text-destructive"}`}>
                {formatCurrency(netProfit)} RWF
              </p>
              <p className="text-xs text-muted-foreground mt-2">{allTransactions.length} total transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>View and manage all your financial transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Transactions</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                {allTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {allTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between">
                        <p>{transaction.description}</p>
                        <p className={transaction.type === "income" ? "text-success" : "text-destructive"}>
                          {formatCurrency(transaction.amount)} RWF
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Wallet className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium mb-2">No transactions yet</p>
                    <p className="text-sm">
                      Start recording your farm income and expenses to track your financial health
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="income" className="mt-6">
                {incomeTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {incomeTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between">
                        <p>{transaction.description}</p>
                        <p className="text-success">{formatCurrency(transaction.amount)} RWF</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <ArrowUpRight className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium mb-2">No income recorded</p>
                    <p className="text-sm">Record your first income transaction</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="expenses" className="mt-6">
                {expenseTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {expenseTransactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between">
                        <p>{transaction.description}</p>
                        <p className="text-destructive">{formatCurrency(transaction.amount)} RWF</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <ArrowDownRight className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium mb-2">No expenses recorded</p>
                    <p className="text-sm">Record your first expense transaction</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <footer className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 AgriAssist Rwanda. All rights reserved. Enzo design.
          </p>
        </footer>
      </main>
    </div>
  )
}
