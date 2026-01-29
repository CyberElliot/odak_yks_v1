"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser, RANKS } from "@/lib/user-context"
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from "recharts"

export function DailySummary() {
  const { user } = useUser()

  if (!user) return null

  const tasks = user.tasks || []
  const today = new Date().toISOString().split("T")[0]
  
  // Calculate today's stats
  const todayTasks = tasks.filter(t => t.createdAt.split("T")[0] === today)
  const completedTodayTasks = todayTasks.filter(t => t.completed)
  const totalQuestionsToday = completedTodayTasks.reduce((acc, t) => acc + t.questions, 0)
  const totalMinutesToday = completedTodayTasks.reduce((acc, t) => acc + t.duration, 0)
  const totalHoursToday = (totalMinutesToday / 60).toFixed(1)
  
  // Calculate XP earned today
  const xpEarnedToday = completedTodayTasks.reduce((acc, t) => acc + t.questions + Math.floor(t.duration * 0.5), 0)
  
  // Daily goal progress
  const dailyGoalHours = user.dailyStudyGoal || 4
  const goalProgress = Math.min(100, (totalMinutesToday / (dailyGoalHours * 60)) * 100)
  
  // Subject breakdown for today
  const subjectBreakdown = completedTodayTasks.reduce((acc, task) => {
    acc[task.subject] = (acc[task.subject] || 0) + task.questions
    return acc
  }, {} as Record<string, number>)
  
  const subjectData = Object.entries(subjectBreakdown).map(([name, value]) => ({
    name,
    value
  }))

  // Hourly activity (mock data based on completed tasks)
  const hourlyData = Array.from({ length: 12 }, (_, i) => {
    const hour = 8 + i
    const hourTasks = completedTodayTasks.filter(t => {
      const taskHour = new Date(t.createdAt).getHours()
      return taskHour === hour
    })
    return {
      hour: `${hour}:00`,
      minutes: hourTasks.reduce((acc, t) => acc + t.duration, 0),
      questions: hourTasks.reduce((acc, t) => acc + t.questions, 0)
    }
  })

  const COLORS = ["#22c55e", "#f59e0b", "#3b82f6", "#ec4899", "#8b5cf6", "#06b6d4"]

  // Motivation message based on progress
  const getMotivationMessage = () => {
    if (goalProgress >= 100) return "Harika! Bugunku hedefini tamamladin!"
    if (goalProgress >= 75) return "Cok iyi gidiyorsun! Biraz daha!"
    if (goalProgress >= 50) return "Yarisini tamamladin, devam et!"
    if (goalProgress >= 25) return "Guzel baslangic! Hizini artir!"
    return "Yeni bir gun, yeni firsatlar! Hadi basla!"
  }

  // Current rank info
  const currentRank = RANKS[user.currentRank]
  const nextRank = RANKS[user.currentRank + 1]

  // Streak calculation (simplified)
  const dailyStats = user.dailyStats || []
  const streak = calculateStreak(dailyStats)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gunun Ozeti</h1>
        <p className="text-muted-foreground">{new Date().toLocaleDateString("tr-TR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      {/* Main Progress Card */}
      <Card className="bg-gradient-to-br from-primary/20 via-card/50 to-accent/20 border-border/50 overflow-hidden">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Circular Progress */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="70%"
                    outerRadius="100%"
                    barSize={12}
                    data={[{ value: goalProgress, fill: "hsl(var(--primary))" }]}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <RadialBar
                      dataKey="value"
                      cornerRadius={10}
                      background={{ fill: "hsl(var(--secondary))" }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-foreground">{Math.round(goalProgress)}%</span>
                  <span className="text-sm text-muted-foreground">Gunluk Hedef</span>
                </div>
              </div>
              <p className="text-center text-foreground font-medium mt-4">{getMotivationMessage()}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background/50 rounded-xl p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-foreground">{totalHoursToday}</p>
                <p className="text-xs text-muted-foreground">Saat Calisma</p>
              </div>
              
              <div className="bg-background/50 rounded-xl p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-foreground">{totalQuestionsToday}</p>
                <p className="text-xs text-muted-foreground">Cozulen Soru</p>
              </div>
              
              <div className="bg-background/50 rounded-xl p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-chart-3/20 flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-chart-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-foreground">{xpEarnedToday}</p>
                <p className="text-xs text-muted-foreground">Kazanilan XP</p>
              </div>
              
              <div className="bg-background/50 rounded-xl p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-foreground">{streak}</p>
                <p className="text-xs text-muted-foreground">Gun Serisi</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Completion & Subject Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Task Completion */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Gorev Durumu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tamamlanan</span>
                <span className="text-foreground font-medium">{completedTodayTasks.length} / {todayTasks.length || completedTodayTasks.length}</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${todayTasks.length > 0 ? (completedTodayTasks.length / todayTasks.length) * 100 : 100}%` }}
                />
              </div>
              
              <div className="space-y-2 mt-4">
                {completedTodayTasks.slice(0, 4).map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{task.subject}</p>
                      <p className="text-xs text-muted-foreground truncate">{task.topic}</p>
                    </div>
                    <span className="text-xs text-accent">+{task.questions + Math.floor(task.duration * 0.5)} XP</span>
                  </div>
                ))}
                {completedTodayTasks.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">Henuz gorev tamamlanmadi</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject Breakdown */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Ders Dagilimi</CardTitle>
          </CardHeader>
          <CardContent>
            {subjectData.length > 0 ? (
              <div className="flex items-center gap-4">
                <div className="w-32 h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subjectData}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {subjectData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
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
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-muted-foreground">Henuz veri yok</p>
                <p className="text-sm text-muted-foreground">Gorev tamamlayinca burada gorunecek</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Hourly Activity */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Gunluk Aktivite</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="rgba(255,255,255,0.5)" fontSize={10} />
                <YAxis stroke="rgba(255,255,255,0.5)" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))"
                  }}
                  formatter={(value: number, name: string) => [
                    name === "minutes" ? `${value} dk` : `${value} soru`,
                    name === "minutes" ? "Sure" : "Soru"
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="minutes"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorMinutes)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Rank Progress */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">{user.currentRank + 1}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-foreground">{currentRank.name}</span>
                {nextRank && (
                  <span className="text-sm text-muted-foreground">Sonraki: {nextRank.name}</span>
                )}
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                {nextRank && (
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                    style={{
                      width: `${((user.totalXP - currentRank.minXP) / (nextRank.minXP - currentRank.minXP)) * 100}%`
                    }}
                  />
                )}
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">{user.totalXP.toLocaleString()} XP</span>
                {nextRank && (
                  <span className="text-xs text-muted-foreground">{nextRank.minXP.toLocaleString()} XP</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper function to calculate streak
function calculateStreak(dailyStats: Array<{ date: string; completedTasks: number }>): number {
  if (dailyStats.length === 0) return 1 // Starting streak
  
  let streak = 0
  const sortedStats = [...dailyStats].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let i = 0; i < sortedStats.length; i++) {
    const statDate = new Date(sortedStats[i].date)
    statDate.setHours(0, 0, 0, 0)
    
    const expectedDate = new Date(today)
    expectedDate.setDate(expectedDate.getDate() - i)
    
    if (statDate.getTime() === expectedDate.getTime() && sortedStats[i].completedTasks > 0) {
      streak++
    } else {
      break
    }
  }
  
  return Math.max(1, streak)
}
