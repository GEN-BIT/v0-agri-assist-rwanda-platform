"use client"

import type { User } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { calculateUserBalance, getTransactions } from "@/lib/data-storage"

interface WalletScreenProps {
  user: User
}

export function WalletScreen({ user }: WalletScreenProps) {
  const balance = calculateUserBalance(user.id)
  const transactions = getTransactions(user.id)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-RW", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const income = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const expenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const netProfit = income - expenses

  return (
    <div className="pb-24 px-4 pt-4 space-y-4 max-w-lg mx-auto">
      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm opacity-90 mb-1">Account Balance</p>
              <p className="text-3xl font-bold">{formatCurrency(balance)} RWF</p>
            </div>
            <Wallet className="w-8 h-8 opacity-50" />
          </div>
          <Button variant="secondary" size="sm" className="w-full">
            Request Withdrawal
          </Button>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground mb-1">Income</p>
            <p className="font-bold text-sm text-success">{formatCurrency(income)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground mb-1">Expenses</p>
            <p className="font-bold text-sm text-destructive">{formatCurrency(expenses)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground mb-1">Net Profit</p>
            <p className={`font-bold text-sm ${netProfit >= 0 ? "text-success" : "text-destructive"}`}>
              {formatCurrency(netProfit)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No transactions yet</p>
          ) : (
            transactions.slice(0, 10).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === "income"
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{transaction.category}</p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>
                </div>
                <p
                  className={`font-semibold text-sm ${
                    transaction.type === "income" ? "text-success" : "text-destructive"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <footer className="text-center text-xs text-muted-foreground pb-4">
        © 2025 AgriAssist Rwanda. All rights reserved. Enzo design.
      </footer>
    </div>
  )
}
