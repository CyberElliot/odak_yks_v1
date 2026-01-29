"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { LoginForm } from "@/components/login-form"
import { FeatureShowcase } from "@/components/feature-showcase"
import { StatsBar } from "@/components/stats-bar"
import { useUser } from "@/lib/user-context"

export default function HomePage() {
  const router = useRouter()
  const { isLoggedIn, isLoading: userLoading } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!userLoading && isLoggedIn) {
      router.push("/dashboard")
    }
  }, [userLoading, isLoggedIn, router])

  return (
    <main className="min-h-screen bg-background">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Glow Effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image 
                src="/logo.png" 
                alt="ODAKyks Logo" 
                width={160} 
                height={50}
                className="h-10 w-auto"
              />
            </div>
            <StatsBar />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 container mx-auto px-4 py-8 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Side - Login Form */}
            <div className="order-2 lg:order-1">
              <LoginForm isLoading={isLoading} setIsLoading={setIsLoading} />
            </div>

            {/* Right Side - Feature Showcase */}
            <div className="order-1 lg:order-2">
              <FeatureShowcase />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border/50 backdrop-blur-sm py-4">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
            <p>2026 ODAKyks. Tum haklar saklidir.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Sistem Aktif
              </span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
