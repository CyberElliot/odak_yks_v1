"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/user-context"
import { ProfileSetup } from "@/components/profile-setup"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DailyTracker } from "@/components/dashboard/daily-tracker"
import { PomodoroTimer } from "@/components/dashboard/pomodoro-timer"
import { StatsPanel } from "@/components/dashboard/stats-panel"
import { ProfilePanel } from "@/components/dashboard/profile-panel"
import { AIAssistant } from "@/components/dashboard/ai-assistant"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoggedIn, isLoading } = useUser()
  const [activeTab, setActiveTab] = useState("daily")
  const [showProfileSetup, setShowProfileSetup] = useState(false)

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/")
    }
  }, [isLoading, isLoggedIn, router])

  useEffect(() => {
    if (user && !user.grade) {
      setShowProfileSetup(true)
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Yukleniyor...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null
  }

  if (showProfileSetup) {
    return <ProfileSetup onComplete={() => setShowProfileSetup(false)} />
  }

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "daily" && <DailyTracker />}
      {activeTab === "pomodoro" && <PomodoroTimer />}
      {activeTab === "stats" && <StatsPanel />}
      {activeTab === "profile" && <ProfilePanel />}
      {activeTab === "ai" && <AIAssistant />}
    </DashboardLayout>
  )
}
