"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/lib/user-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type TimerMode = "pomodoro" | "shortBreak" | "longBreak"

const SUBJECTS = [
  "Matematik", "Fizik", "Kimya", "Biyoloji", "Turkce", 
  "Tarih", "Cografya", "Felsefe", "Ingilizce", "Diger"
]

// Global timer state to persist across tab changes
let globalTimerState = {
  timeLeft: 25 * 60,
  isRunning: false,
  mode: "pomodoro" as TimerMode,
  completedPomodoros: 0,
  totalMinutesToday: 0,
  currentTask: null as { subject: string; topic: string } | null,
  startTime: null as number | null,
  endTime: null as number | null
}

export function PomodoroTimer() {
  const { user, addXP, addTask, updatePomodoroSettings } = useUser()
  const [mode, setMode] = useState<TimerMode>(globalTimerState.mode)
  const [timeLeft, setTimeLeft] = useState(globalTimerState.timeLeft)
  const [isRunning, setIsRunning] = useState(globalTimerState.isRunning)
  const [completedPomodoros, setCompletedPomodoros] = useState(globalTimerState.completedPomodoros)
  const [totalMinutesToday, setTotalMinutesToday] = useState(globalTimerState.totalMinutesToday)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  
  // Settings state
  const [workDuration, setWorkDuration] = useState(25)
  const [shortBreakDuration, setShortBreakDuration] = useState(5)
  const [longBreakDuration, setLongBreakDuration] = useState(15)
  
  // Task state
  const [taskSubject, setTaskSubject] = useState("")
  const [taskTopic, setTaskTopic] = useState("")
  const [taskQuestions, setTaskQuestions] = useState("10")
  const [currentTask, setCurrentTask] = useState<{ subject: string; topic: string } | null>(globalTimerState.currentTask)

  // Initialize settings from user
  useEffect(() => {
    if (user?.pomodoroSettings) {
      setWorkDuration(user.pomodoroSettings.workDuration)
      setShortBreakDuration(user.pomodoroSettings.shortBreakDuration)
      setLongBreakDuration(user.pomodoroSettings.longBreakDuration)
      
      // Only set initial time if timer is not running
      if (!globalTimerState.isRunning && !globalTimerState.startTime) {
        setTimeLeft(user.pomodoroSettings.workDuration * 60)
        globalTimerState.timeLeft = user.pomodoroSettings.workDuration * 60
      }
    }
  }, [user?.pomodoroSettings])

  // Sync with global state on mount
  useEffect(() => {
    if (globalTimerState.isRunning && globalTimerState.endTime) {
      const now = Date.now()
      const remaining = Math.max(0, Math.floor((globalTimerState.endTime - now) / 1000))
      setTimeLeft(remaining)
      globalTimerState.timeLeft = remaining
    }
    setMode(globalTimerState.mode)
    setIsRunning(globalTimerState.isRunning)
    setCompletedPomodoros(globalTimerState.completedPomodoros)
    setTotalMinutesToday(globalTimerState.totalMinutesToday)
    setCurrentTask(globalTimerState.currentTask)
  }, [])

  // Update global state whenever local state changes
  useEffect(() => {
    globalTimerState.timeLeft = timeLeft
    globalTimerState.isRunning = isRunning
    globalTimerState.mode = mode
    globalTimerState.completedPomodoros = completedPomodoros
    globalTimerState.totalMinutesToday = totalMinutesToday
    globalTimerState.currentTask = currentTask
  }, [timeLeft, isRunning, mode, completedPomodoros, totalMinutesToday, currentTask])

  const getTimerSettings = useCallback(() => ({
    pomodoro: { label: "Pomodoro", duration: workDuration * 60, color: "text-primary" },
    shortBreak: { label: "Kisa Mola", duration: shortBreakDuration * 60, color: "text-accent" },
    longBreak: { label: "Uzun Mola", duration: longBreakDuration * 60, color: "text-chart-3" }
  }), [workDuration, shortBreakDuration, longBreakDuration])

  const currentSettings = getTimerSettings()[mode]

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Play alarm sound - multiple beeps
  const playAlarmSound = useCallback(() => {
    if (typeof window === "undefined") return

    const playBeep = (frequency: number, duration: number, delay: number) => {
      setTimeout(() => {
        try {
          const audioContext = new AudioContext()
          const oscillator = audioContext.createOscillator()
          const gainNode = audioContext.createGain()
          
          oscillator.connect(gainNode)
          gainNode.connect(audioContext.destination)
          
          oscillator.frequency.value = frequency
          oscillator.type = "sine"
          
          gainNode.gain.setValueAtTime(0.4, audioContext.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000)
          
          oscillator.start(audioContext.currentTime)
          oscillator.stop(audioContext.currentTime + duration / 1000)
          
          setTimeout(() => audioContext.close(), duration + 100)
        } catch {
          // Silent fallback
        }
      }, delay)
    }

    // Play 4 beeps - alarm pattern
    playBeep(880, 300, 0)
    playBeep(880, 300, 400)
    playBeep(880, 300, 800)
    playBeep(1100, 500, 1200)
  }, [])

  const handleComplete = useCallback(() => {
    const settings = getTimerSettings()
    
    // Play alarm
    playAlarmSound()
    
    // Show browser notification if permitted
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      new Notification("ODAKyks - Pomodoro", {
        body: mode === "pomodoro" ? "Calisma suresi bitti! Mola zamani." : "Mola bitti! Calismaya devam.",
        icon: "/logo.png"
      })
    }
    
    if (mode === "pomodoro") {
      const newCompletedPomodoros = completedPomodoros + 1
      setCompletedPomodoros(newCompletedPomodoros)
      setTotalMinutesToday((prev) => prev + workDuration)
      
      // Award XP
      const xpEarned = Math.floor(workDuration * 0.5)
      addXP(xpEarned)
      
      // Add task to daily tracker if set
      if (currentTask) {
        addTask({
          subject: currentTask.subject,
          topic: currentTask.topic,
          duration: workDuration,
          questions: Number.parseInt(taskQuestions) || 10,
          completed: true
        })
        setCurrentTask(null)
        globalTimerState.currentTask = null
        setTaskSubject("")
        setTaskTopic("")
      }
      
      // Switch to break
      if (newCompletedPomodoros % 4 === 0) {
        setMode("longBreak")
        setTimeLeft(settings.longBreak.duration)
        globalTimerState.mode = "longBreak"
        globalTimerState.timeLeft = settings.longBreak.duration
      } else {
        setMode("shortBreak")
        setTimeLeft(settings.shortBreak.duration)
        globalTimerState.mode = "shortBreak"
        globalTimerState.timeLeft = settings.shortBreak.duration
      }
    } else {
      // Break finished, switch to pomodoro
      setMode("pomodoro")
      setTimeLeft(settings.pomodoro.duration)
      globalTimerState.mode = "pomodoro"
      globalTimerState.timeLeft = settings.pomodoro.duration
    }
    
    setIsRunning(false)
    globalTimerState.isRunning = false
    globalTimerState.endTime = null
    globalTimerState.startTime = null
  }, [mode, completedPomodoros, addXP, addTask, workDuration, currentTask, taskQuestions, getTimerSettings, playAlarmSound])

  // Timer effect - uses time-based calculation for accuracy
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isRunning) {
      interval = setInterval(() => {
        if (globalTimerState.endTime) {
          const now = Date.now()
          const remaining = Math.max(0, Math.floor((globalTimerState.endTime - now) / 1000))
          
          if (remaining <= 0) {
            handleComplete()
          } else {
            setTimeLeft(remaining)
            globalTimerState.timeLeft = remaining
          }
        }
      }, 100) // Check more frequently for accuracy
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, handleComplete])

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  const toggleTimer = () => {
    if (!isRunning) {
      // Starting timer
      const now = Date.now()
      globalTimerState.startTime = now
      globalTimerState.endTime = now + (timeLeft * 1000)
      setIsRunning(true)
      globalTimerState.isRunning = true
    } else {
      // Pausing timer
      globalTimerState.startTime = null
      globalTimerState.endTime = null
      setIsRunning(false)
      globalTimerState.isRunning = false
    }
  }

  const resetTimer = () => {
    setIsRunning(false)
    globalTimerState.isRunning = false
    globalTimerState.startTime = null
    globalTimerState.endTime = null
    setTimeLeft(currentSettings.duration)
    globalTimerState.timeLeft = currentSettings.duration
  }

  const switchMode = (newMode: TimerMode) => {
    const settings = getTimerSettings()
    setMode(newMode)
    setTimeLeft(settings[newMode].duration)
    setIsRunning(false)
    globalTimerState.mode = newMode
    globalTimerState.timeLeft = settings[newMode].duration
    globalTimerState.isRunning = false
    globalTimerState.startTime = null
    globalTimerState.endTime = null
  }

  const saveSettings = () => {
    updatePomodoroSettings({
      workDuration,
      shortBreakDuration,
      longBreakDuration
    })
    if (!isRunning) {
      setTimeLeft(workDuration * 60)
      globalTimerState.timeLeft = workDuration * 60
    }
    setIsSettingsOpen(false)
  }

  const handleSetTask = () => {
    if (taskSubject && taskTopic) {
      setCurrentTask({ subject: taskSubject, topic: taskTopic })
      globalTimerState.currentTask = { subject: taskSubject, topic: taskTopic }
      setIsTaskDialogOpen(false)
    }
  }

  const progress = currentSettings.duration > 0 
    ? ((currentSettings.duration - timeLeft) / currentSettings.duration) * 100 
    : 0

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pomodoro Timer</h1>
          <p className="text-muted-foreground">Odaklanma surelerini yonet, verimliligini artir</p>
        </div>
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-border text-muted-foreground bg-transparent">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Ayarlar
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Pomodoro Ayarlari</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Calisma ve mola surelerini ozellestirebilirsiniz
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label className="text-foreground">Calisma Suresi (dakika)</Label>
                <Input
                  type="number"
                  value={workDuration}
                  onChange={(e) => setWorkDuration(Number.parseInt(e.target.value) || 25)}
                  className="bg-input border-border text-foreground"
                  min={1}
                  max={120}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Kisa Mola (dakika)</Label>
                <Input
                  type="number"
                  value={shortBreakDuration}
                  onChange={(e) => setShortBreakDuration(Number.parseInt(e.target.value) || 5)}
                  className="bg-input border-border text-foreground"
                  min={1}
                  max={30}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Uzun Mola (dakika)</Label>
                <Input
                  type="number"
                  value={longBreakDuration}
                  onChange={(e) => setLongBreakDuration(Number.parseInt(e.target.value) || 15)}
                  className="bg-input border-border text-foreground"
                  min={1}
                  max={60}
                />
              </div>
              <Button onClick={saveSettings} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Kaydet
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Timer Status Banner */}
      {isRunning && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <span className="text-foreground font-medium">
              {mode === "pomodoro" ? "Calisma" : mode === "shortBreak" ? "Kisa Mola" : "Uzun Mola"} devam ediyor
            </span>
          </div>
          <span className="text-primary font-mono font-bold">{formatTime(timeLeft)}</span>
        </div>
      )}

      {/* Current Task */}
      {currentTask && (
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="py-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-foreground font-medium">
                  {currentTask.subject} - {currentTask.topic}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setCurrentTask(null)
                  globalTimerState.currentTask = null
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timer Card */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="pt-6">
          {/* Mode Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {(["pomodoro", "shortBreak", "longBreak"] as TimerMode[]).map((m) => (
              <Button
                key={m}
                variant={mode === m ? "default" : "outline"}
                size="sm"
                onClick={() => switchMode(m)}
                className={mode === m 
                  ? "bg-primary text-primary-foreground" 
                  : "border-border text-muted-foreground hover:text-foreground bg-transparent"
                }
              >
                {getTimerSettings()[m].label}
              </Button>
            ))}
          </div>

          {/* Timer Display */}
          <div className="relative w-64 h-64 mx-auto mb-8">
            {/* Progress Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-secondary"
              />
              <circle
                cx="128"
                cy="128"
                r="120"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                className={currentSettings.color}
                style={{ transition: "stroke-dashoffset 0.5s linear" }}
              />
            </svg>
            {/* Time Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-5xl font-bold font-mono ${currentSettings.color}`}>
                {formatTime(timeLeft)}
              </span>
              <span className="text-sm text-muted-foreground mt-2">
                {currentSettings.label}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              onClick={toggleTimer}
              className="w-32 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isRunning ? (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                  Duraklat
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Basla
                </span>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={resetTimer}
              className="border-border text-muted-foreground hover:text-foreground bg-transparent"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </Button>
            
            {/* Add Task Button */}
            <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border text-muted-foreground hover:text-foreground bg-transparent"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Gorev Ekle</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Bu pomodoro icin gorev belirle. Tamamladiginda gunluk takibe eklenecek.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Ders</Label>
                    <Select value={taskSubject} onValueChange={setTaskSubject}>
                      <SelectTrigger className="bg-input border-border text-foreground">
                        <SelectValue placeholder="Ders secin" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {SUBJECTS.map(subj => (
                          <SelectItem key={subj} value={subj} className="text-foreground">
                            {subj}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Konu</Label>
                    <Input
                      value={taskTopic}
                      onChange={(e) => setTaskTopic(e.target.value)}
                      placeholder="ornek: Turev ve Integral"
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Tahmini Soru Sayisi</Label>
                    <Input
                      type="number"
                      value={taskQuestions}
                      onChange={(e) => setTaskQuestions(e.target.value)}
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                  <Button 
                    onClick={handleSetTask} 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={!taskSubject || !taskTopic}
                  >
                    Gorev Belirle
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-primary">{completedPomodoros}</p>
            <p className="text-xs text-muted-foreground mt-1">Pomodoro</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-foreground">{totalMinutesToday}</p>
            <p className="text-xs text-muted-foreground mt-1">Dakika</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-accent">{completedPomodoros * Math.floor(workDuration * 0.5)}</p>
            <p className="text-xs text-muted-foreground mt-1">Kazanilan XP</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-foreground">{4 - (completedPomodoros % 4)}</p>
            <p className="text-xs text-muted-foreground mt-1">Uzun Molaya</p>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Pomodoro Teknigi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. Her {workDuration} dakikalik odakli calismadan sonra {shortBreakDuration} dakika mola ver</p>
          <p>2. 4 pomodoro tamamladiginda {longBreakDuration} dakikalik uzun mola al</p>
          <p>3. Calisma sirasinda dikkat dagitici seyleri uzaklastir</p>
          <p>4. Her pomodoro icin belirli bir gorev sec ve odaklan</p>
        </CardContent>
      </Card>
    </div>
  )
}
