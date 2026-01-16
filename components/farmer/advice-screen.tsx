"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, Droplet, Bug, Sun, Wind } from "lucide-react"

export function AdviceScreen() {
  const adviceTips = [
    {
      id: 1,
      icon: <Droplet className="w-6 h-6" />,
      title: "Irrigation Tips",
      tip: "Water early morning or late evening to reduce water loss through evaporation.",
    },
    {
      id: 2,
      icon: <Bug className="w-6 h-6" />,
      title: "Pest Management",
      tip: "Check your crops daily for pests. Early detection prevents major damage.",
    },
    {
      id: 3,
      icon: <Sun className="w-6 h-6" />,
      title: "Soil Care",
      tip: "Add compost to your soil quarterly to improve fertility and water retention.",
    },
    {
      id: 4,
      icon: <Wind className="w-6 h-6" />,
      title: "Weather Monitoring",
      tip: "Heavy rains expected in 3 days. Secure loose structures and improve drainage.",
    },
  ]

  return (
    <div className="pb-24 px-4 pt-4 space-y-4 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            AI Farm Advice
          </CardTitle>
          <CardDescription>Personalized tips for better farming</CardDescription>
        </CardHeader>
      </Card>

      <Card className="bg-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <p className="font-semibold text-sm mb-2">📌 What to do today:</p>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li>✓ Water crops (morning or evening)</li>
            <li>✓ Check for pests on beans</li>
            <li>✓ Weeding required in maize plot</li>
          </ul>
        </CardContent>
      </Card>

      {adviceTips.map((advice) => (
        <Card key={advice.id}>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="text-primary flex-shrink-0">{advice.icon}</div>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">{advice.title}</p>
                <p className="text-sm text-muted-foreground">{advice.tip}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground mb-4">💬 Need more help? Talk to ENZO, our AI assistant.</p>
          <Button className="w-full">Chat with ENZO</Button>
        </CardContent>
      </Card>

      <footer className="text-center text-xs text-muted-foreground pb-4">
        © 2025 AgriAssist Rwanda. All rights reserved. Enzo design.
      </footer>
    </div>
  )
}
