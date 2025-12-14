"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, X, Minimize2 } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export function EnzoChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I am ENZO, your AgriAssist AI assistant. How can I help you improve your farming today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  const generateBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()

    if (lowerInput.includes("crop") || lowerInput.includes("plant")) {
      return "To manage your crops effectively, go to the Farm Management section. You can track planting dates, expected harvest dates, and monitor crop health. Would you like tips on specific crops?"
    }
    if (lowerInput.includes("price") || lowerInput.includes("market")) {
      return "Check the Market Access section to see current prices for your products across different markets in Rwanda. You can also find verified buyers there. Which product are you interested in?"
    }
    if (lowerInput.includes("finance") || lowerInput.includes("money") || lowerInput.includes("income")) {
      return "Track your farm finances in the Financial Management section. Record all income and expenses to see your net profit. This helps you make better financial decisions. Need help setting up your first transaction?"
    }
    if (lowerInput.includes("livestock") || lowerInput.includes("animal")) {
      return "The Farm Management module has a dedicated Livestock section where you can track your animals, their health status, and production. Would you like guidance on livestock best practices?"
    }
    if (lowerInput.includes("help") || lowerInput.includes("how")) {
      return "I can help you with: 📊 Farm Management, 💰 Financial Tracking, 🏪 Market Prices, 🌾 Crop Planning, 🐄 Livestock Management, and more. What would you like to learn about?"
    }
    if (lowerInput.includes("weather") || lowerInput.includes("rain")) {
      return "Weather planning is crucial for farming success. Based on Rwanda's seasons, plan your planting during the rainy seasons (September-December and March-May). Would you like crop recommendations for the current season?"
    }

    return "I'm here to help you with your farming activities! You can ask me about crop management, market prices, financial tracking, livestock care, or any farming-related questions. What would you like to know?"
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg hover:scale-110 transition-transform z-50"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <Card
      className={`fixed bottom-6 right-6 w-96 shadow-2xl z-50 transition-all ${isMinimized ? "h-16" : "h-[500px]"}`}
    >
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <CardTitle className="text-lg">ENZO AI Assistant</CardTitle>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 h-[380px]">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>

          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex gap-2"
            >
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask ENZO anything..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </>
      )}
    </Card>
  )
}
