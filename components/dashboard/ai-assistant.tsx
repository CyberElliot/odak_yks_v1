"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from "@/lib/user-context"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const QUICK_PROMPTS = [
  "Bugunku calisma planım nasil olmali?",
  "Matematik icin calisma onerileri",
  "Motivasyonumu nasil artırabilirim?",
  "Verimli calisma teknikleri nelerdir?"
]

// Simple local responses for demo
function getLocalResponse(message: string, userName: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes("plan") || lowerMessage.includes("program")) {
    return `${userName}, bugunku calisma planin icin su onerileri sunabilirim:\n\n1. Sabah erken kalk ve zor konularla basla (ornegin Matematik)\n2. Her 25 dakikada bir kisa mola ver (Pomodoro teknigi)\n3. Ogleden sonra tekrar ve soru cozumune odaklan\n4. Aksam hafif konulari tekrar et\n\nGunluk hedef: En az 6 saat etkili calisma!`
  }
  
  if (lowerMessage.includes("matematik")) {
    return `Matematik calismasi icin onerilerim:\n\n1. Once temel kavramlari saglamlastir\n2. Her konudan en az 30 soru coz\n3. Yanlis sorulari ayri bir deftere not al\n4. Haftada bir tum yanlislari tekrar coz\n5. Zaman tutarak soru cozmeni oneririm\n\nTurev ve integral konularina ozellikle dikkat et!`
  }
  
  if (lowerMessage.includes("motivasyon")) {
    return `${userName}, motivasyonunu artirmak icin:\n\n1. Kucuk hedefler koy ve basardiginda kendini odulendir\n2. Calisma ortamini duzenli tut\n3. Yorulunca kisa molalar ver ama telefondan uzak dur\n4. Hedefini her gun hatirla - neden bu sinava giriyorsun?\n5. Basarili ogrencilerin hikayelerini oku\n\nUnutma: Her soru seni hedefe bir adim daha yaklastiriyor!`
  }
  
  if (lowerMessage.includes("verimli") || lowerMessage.includes("teknik")) {
    return `Verimli calisma teknikleri:\n\n1. Pomodoro Teknigi: 25 dk calisma + 5 dk mola\n2. Active Recall: Konuyu okuduktan sonra kitabi kapatip hatirlamaya calis\n3. Spaced Repetition: Konulari araliklarla tekrar et\n4. Feynman Teknigi: Konuyu birine anlatir gibi ogren\n5. Mind Mapping: Konulari sema haline getir\n\nEn onemli kural: Tutarlilik! Her gun duzgun calisma.`
  }
  
  return `${userName}, sorunuzu anladim. YKS hazirligi surecinde size yardimci olmaya calisacagim. Calisma plani, ders onerileri veya motivasyon konularinda daha spesifik sorular sorabilirsiniz. Birlikte bu sureci basariyla atlatacagiz!`
}

export function AIAssistant() {
  const { user } = useUser()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Merhaba ${user?.userName || ""}! Ben YKS Takip asistaniyim. Sana calisma plani, ders onerileri ve motivasyon konularinda yardimci olabilirim. Nasil yardimci olabilirim?`
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getLocalResponse(content, user?.userName || "")
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsLoading(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Asistan</h1>
        <p className="text-muted-foreground">YKS hazirlik surecinde sana yardimci olacak kisisel asistanin</p>
      </div>

      {/* Chat Container */}
      <Card className="bg-card/50 border-border/50 h-[500px] flex flex-col">
        <CardHeader className="border-b border-border/50 py-3">
          <CardTitle className="text-base text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            YKS Asistan
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </CardTitle>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-secondary text-foreground rounded-xl px-4 py-3">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Input */}
        <div className="border-t border-border/50 p-4">
          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-2 mb-3">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                className="text-xs px-3 py-1.5 rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                disabled={isLoading}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Mesajinizi yazin..."
              className="flex-1 bg-input border-border text-foreground"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </Button>
          </form>
        </div>
      </Card>

      {/* Info Card */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-foreground">AI Asistan Hakkinda</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Bu asistan YKS hazirlik surecinde sana yardimci olmak icin tasarlandi. 
                Calisma plani, ders tavsiyeleri ve motivasyon konularinda sorular sorabilirsin.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
