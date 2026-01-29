"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Task {
  id: string
  subject: string
  topic: string
  duration: number
  questions: number
  completed: boolean
  createdAt: string
}

export interface DailyStats {
  date: string
  completedTasks: number
  totalQuestions: number
  totalMinutes: number
  xpEarned: number
}

export interface UserProfile {
  userCode: string
  userName: string
  grade: string
  field: string
  targetRank: string
  targetUniversity: string
  targetDepartment: string
  dailyStudyGoal: number
  totalXP: number
  currentRank: number
  completedTopics: string[]
  createdAt: string
  tasks: Task[]
  dailyStats: DailyStats[]
  pomodoroSettings: {
    workDuration: number
    shortBreakDuration: number
    longBreakDuration: number
  }
}

interface UserContextType {
  user: UserProfile | null
  isLoggedIn: boolean
  isLoading: boolean
  validCodes: string[]
  login: (userCode: string, userName: string) => Promise<boolean>
  register: (userCode: string, userName: string) => Promise<boolean>
  updateProfile: (profile: Partial<UserProfile>) => void
  logout: () => void
  addXP: (amount: number) => void
  addTask: (task: Omit<Task, "id" | "createdAt">) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  deleteTask: (taskId: string) => void
  toggleTaskComplete: (taskId: string) => number
  saveDailyStats: (stats: Omit<DailyStats, "date">) => void
  updatePomodoroSettings: (settings: UserProfile["pomodoroSettings"]) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const RANKS = [
  { name: "Yeni Baslayan", minXP: 0 },
  { name: "Caliskan", minXP: 500 },
  { name: "Azimli", minXP: 1500 },
  { name: "Odakli", minXP: 3000 },
  { name: "Profesyonel", minXP: 5000 },
  { name: "Uzman", minXP: 8000 },
  { name: "Usta", minXP: 12000 },
  { name: "Efsane", minXP: 18000 },
  { name: "YKS Savascisi", minXP: 25000 },
  { name: "YKS Bukucusu", minXP: 35000 }
]

// 50 unique registration codes
const VALID_REGISTRATION_CODES = [
  "ODAK2026A1", "ODAK2026A2", "ODAK2026A3", "ODAK2026A4", "ODAK2026A5",
  "ODAK2026B1", "ODAK2026B2", "ODAK2026B3", "ODAK2026B4", "ODAK2026B5",
  "ODAK2026C1", "ODAK2026C2", "ODAK2026C3", "ODAK2026C4", "ODAK2026C5",
  "ODAK2026D1", "ODAK2026D2", "ODAK2026D3", "ODAK2026D4", "ODAK2026D5",
  "ODAK2026E1", "ODAK2026E2", "ODAK2026E3", "ODAK2026E4", "ODAK2026E5",
  "ODAK2026F1", "ODAK2026F2", "ODAK2026F3", "ODAK2026F4", "ODAK2026F5",
  "ODAK2026G1", "ODAK2026G2", "ODAK2026G3", "ODAK2026G4", "ODAK2026G5",
  "ODAK2026H1", "ODAK2026H2", "ODAK2026H3", "ODAK2026H4", "ODAK2026H5",
  "ODAK2026J1", "ODAK2026J2", "ODAK2026J3", "ODAK2026J4", "ODAK2026J5",
  "ODAK2026K1", "ODAK2026K2", "ODAK2026K3", "ODAK2026K4", "ODAK2026K5"
]

const DEFAULT_TASKS: Task[] = [
  { id: "default-1", subject: "Matematik", topic: "Limit ve Sureklilik", duration: 60, questions: 20, completed: false, createdAt: new Date().toISOString() },
  { id: "default-2", subject: "Fizik", topic: "Kuvvet ve Hareket", duration: 45, questions: 15, completed: false, createdAt: new Date().toISOString() },
  { id: "default-3", subject: "Kimya", topic: "Mol Kavrami", duration: 45, questions: 15, completed: false, createdAt: new Date().toISOString() },
  { id: "default-4", subject: "Turkce", topic: "Paragraf Cozumu", duration: 30, questions: 25, completed: false, createdAt: new Date().toISOString() },
  { id: "default-5", subject: "Biyoloji", topic: "Hucre Bolunmesi", duration: 30, questions: 10, completed: false, createdAt: new Date().toISOString() }
]

function calculateRank(xp: number): number {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].minXP) return i
  }
  return 0
}

function generateId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("odak_user")
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        // Ensure tasks array exists
        if (!parsed.tasks) {
          parsed.tasks = DEFAULT_TASKS
        }
        if (!parsed.dailyStats) {
          parsed.dailyStats = []
        }
        if (!parsed.pomodoroSettings) {
          parsed.pomodoroSettings = {
            workDuration: 25,
            shortBreakDuration: 5,
            longBreakDuration: 15
          }
        }
        setUser(parsed)
      } catch {
        localStorage.removeItem("odak_user")
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem("odak_user", JSON.stringify(user))
      // Also update in users storage
      const existingUsers = JSON.parse(localStorage.getItem("odak_users") || "{}")
      existingUsers[user.userCode] = user
      localStorage.setItem("odak_users", JSON.stringify(existingUsers))
    }
  }, [user])

  const login = async (userCode: string, userName: string): Promise<boolean> => {
    const existingUsers = JSON.parse(localStorage.getItem("odak_users") || "{}")
    const upperCode = userCode.toUpperCase()
    
    if (existingUsers[upperCode]) {
      const savedUser = existingUsers[upperCode]
      if (savedUser.userName.toLowerCase() === userName.toLowerCase()) {
        // Ensure tasks exist
        if (!savedUser.tasks) {
          savedUser.tasks = DEFAULT_TASKS
        }
        if (!savedUser.dailyStats) {
          savedUser.dailyStats = []
        }
        if (!savedUser.pomodoroSettings) {
          savedUser.pomodoroSettings = {
            workDuration: 25,
            shortBreakDuration: 5,
            longBreakDuration: 15
          }
        }
        setUser(savedUser)
        return true
      }
      return false
    }
    return false
  }

  const register = async (userCode: string, userName: string): Promise<boolean> => {
    const upperCode = userCode.toUpperCase()
    
    // Check if code is valid
    if (!VALID_REGISTRATION_CODES.includes(upperCode)) {
      return false
    }
    
    const existingUsers = JSON.parse(localStorage.getItem("odak_users") || "{}")
    
    // Check if code is already used
    if (existingUsers[upperCode]) {
      return false
    }

    const newUser: UserProfile = {
      userCode: upperCode,
      userName,
      grade: "",
      field: "",
      targetRank: "",
      targetUniversity: "",
      targetDepartment: "",
      dailyStudyGoal: 4,
      totalXP: 0,
      currentRank: 0,
      completedTopics: [],
      createdAt: new Date().toISOString(),
      tasks: [...DEFAULT_TASKS],
      dailyStats: [],
      pomodoroSettings: {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15
      }
    }

    existingUsers[upperCode] = newUser
    localStorage.setItem("odak_users", JSON.stringify(existingUsers))
    setUser(newUser)
    return true
  }

  const updateProfile = (profile: Partial<UserProfile>) => {
    if (!user) return
    const updatedUser = { ...user, ...profile }
    setUser(updatedUser)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("odak_user")
  }

  const addXP = (amount: number) => {
    if (!user) return
    const newXP = user.totalXP + amount
    const newRank = calculateRank(newXP)
    updateProfile({
      totalXP: newXP,
      currentRank: newRank
    })
  }

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    if (!user) return
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date().toISOString()
    }
    updateProfile({
      tasks: [...user.tasks, newTask]
    })
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    if (!user) return
    updateProfile({
      tasks: user.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
    })
  }

  const deleteTask = (taskId: string) => {
    if (!user) return
    updateProfile({
      tasks: user.tasks.filter(t => t.id !== taskId)
    })
  }

  const toggleTaskComplete = (taskId: string): number => {
    if (!user) return 0
    let xpEarned = 0
    const updatedTasks = user.tasks.map(task => {
      if (task.id === taskId) {
        const newCompleted = !task.completed
        if (newCompleted) {
          xpEarned = task.questions + Math.floor(task.duration * 0.5)
        }
        return { ...task, completed: newCompleted }
      }
      return task
    })
    
    if (xpEarned > 0) {
      const newXP = user.totalXP + xpEarned
      const newRank = calculateRank(newXP)
      setUser({
        ...user,
        tasks: updatedTasks,
        totalXP: newXP,
        currentRank: newRank
      })
    } else {
      updateProfile({ tasks: updatedTasks })
    }
    
    return xpEarned
  }

  const saveDailyStats = (stats: Omit<DailyStats, "date">) => {
    if (!user) return
    const today = new Date().toISOString().split("T")[0]
    const existingIndex = user.dailyStats.findIndex(s => s.date === today)
    
    let newStats: DailyStats[]
    if (existingIndex >= 0) {
      newStats = [...user.dailyStats]
      newStats[existingIndex] = { ...stats, date: today }
    } else {
      newStats = [...user.dailyStats, { ...stats, date: today }]
    }
    
    updateProfile({ dailyStats: newStats })
  }

  const updatePomodoroSettings = (settings: UserProfile["pomodoroSettings"]) => {
    if (!user) return
    updateProfile({ pomodoroSettings: settings })
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        validCodes: VALID_REGISTRATION_CODES,
        login,
        register,
        updateProfile,
        logout,
        addXP,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        saveDailyStats,
        updatePomodoroSettings
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

export { RANKS }
