"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser, RANKS } from "@/lib/user-context"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts"

export function StatsPanel() {
  const { user } = useUser()

  if (!user) return null

  const currentRank = RANKS[user.currentRank]
  const nextRank = RANKS[user.currentRank + 1]
  const xpToNextRank = nextRank ? nextRank.minXP - user.totalXP : 0

  // Calculate stats
  const tasks = user.tasks || []
  const dailyStats = user.dailyStats || []
  
  const completedTasks = tasks.filter(t => t.completed)
  const totalQuestions = completedTasks.reduce((acc, t) => acc + t.questions, 0)
  const totalMinutes = completedTasks.reduce((acc, t) => acc + t.duration, 0)
  const totalHours = Math.floor(totalMinutes / 60)
  
  // Subject distribution
  const subjectStats = tasks.reduce((acc, task) => {
    if (task.completed) {
      acc[task.subject] = (acc[task.subject] || 0) + task.questions
    }
    return acc
  }, {} as Record<string, number>)
  
  const subjectData = Object.entries(subjectStats).map(([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value)

  // Generate mock weekly data if no real data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dateStr = date.toISOString().split("T")[0]
    const stat = dailyStats.find(s => s.date === dateStr)
    return {
      day: date.toLocaleDateString("tr-TR", { weekday: "short" }),
      xp: stat?.xpEarned || Math.floor(Math.random() * 100) + 20,
      questions: stat?.totalQuestions || Math.floor(Math.random() * 30) + 5,
      minutes: stat?.totalMinutes || Math.floor(Math.random() * 120) + 30
    }
  })

  const COLORS = ["#22c55e", "#f59e0b", "#3b82f6", "#ec4899", "#8b5cf6", "#06b6d4", "#ef4444", "#84cc16"]

  const estimatedDays = Math.max(1, Math.floor(user.totalXP / 100))
  const avgDailyXP = Math.floor(user.totalXP / estimatedDays)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Istatistikler</h1>
        <p className="text-muted-foreground">Ilerleme ve performans analizin</p>
      </div>

      {/* Rank Card */}
      <Card className="bg-card/50 border-border/50 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-background/50 flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">{user.currentRank + 1}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Mevcut Rank</p>
              <h2 className="text-2xl font-bold text-foreground">{currentRank.name}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Toplam XP</p>
              <p className="text-2xl font-bold text-accent">{user.totalXP.toLocaleString()}</p>
            </div>
          </div>
          
          {nextRank && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Sonraki: {nextRank.name}</span>
                <span className="text-foreground">{xpToNextRank.toLocaleString()} XP kaldi</span>
              </div>
              <div className="h-2 bg-background/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{
                    width: `${((user.totalXP - currentRank.minXP) / (nextRank.minXP - currentRank.minXP)) * 100}%`
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-foreground">{totalQuestions.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-1">Cozulen Soru</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-foreground">{totalHours}</p>
            <p className="text-sm text-muted-foreground mt-1">Saat Calisma</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 rounded-full bg-chart-3/20 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-chart-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-foreground">{completedTasks.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Gorev Tamamlandi</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-foreground">{avgDailyXP}</p>
            <p className="text-sm text-muted-foreground mt-1">Gunluk Ort. XP</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly XP Chart */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Haftalik XP Ilerleme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={last7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="xp"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Questions by Day */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Gunluk Soru Sayisi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))"
                    }}
                  />
                  <Bar dataKey="questions" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject Distribution */}
      {subjectData.length > 0 && (
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Ders Dagilimi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={subjectData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {subjectData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        color: "hsl(var(--foreground))"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center space-y-2">
                {subjectData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm text-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{item.value} soru</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rank Progress */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Rank Sistemi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {RANKS.map((rank, index) => {
              const isCurrentRank = index === user.currentRank
              const isCompleted = index < user.currentRank
              const rankNextRank = RANKS[index + 1]
              const progress = isCurrentRank && rankNextRank
                ? ((user.totalXP - rank.minXP) / (rankNextRank.minXP - rank.minXP)) * 100
                : isCompleted ? 100 : 0

              return (
                <div key={rank.name} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isCompleted ? "bg-primary text-primary-foreground" :
                    isCurrentRank ? "bg-primary/20 text-primary border-2 border-primary" :
                    "bg-secondary text-muted-foreground"
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm font-medium ${
                        isCurrentRank ? "text-primary" : 
                        isCompleted ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {rank.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {rank.minXP.toLocaleString()} XP
                      </span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${isCompleted || isCurrentRank ? "bg-primary" : ""}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
