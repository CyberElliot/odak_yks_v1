"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser, type Task } from "@/lib/user-context"
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

const SUBJECTS = [
  { value: "Matematik", color: "bg-blue-500/20 text-blue-400" },
  { value: "Fizik", color: "bg-purple-500/20 text-purple-400" },
  { value: "Kimya", color: "bg-green-500/20 text-green-400" },
  { value: "Biyoloji", color: "bg-yellow-500/20 text-yellow-400" },
  { value: "Turkce", color: "bg-red-500/20 text-red-400" },
  { value: "Tarih", color: "bg-orange-500/20 text-orange-400" },
  { value: "Cografya", color: "bg-teal-500/20 text-teal-400" },
  { value: "Felsefe", color: "bg-pink-500/20 text-pink-400" },
  { value: "Ingilizce", color: "bg-indigo-500/20 text-indigo-400" },
  { value: "Diger", color: "bg-gray-500/20 text-gray-400" }
]

export function DailyTracker() {
  const { user, toggleTaskComplete, addTask, updateTask, deleteTask } = useUser()
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [tempTopic, setTempTopic] = useState("")
  const [tempDuration, setTempDuration] = useState("")
  const [tempQuestions, setTempQuestions] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newTaskSubject, setNewTaskSubject] = useState("")
  const [newTaskTopic, setNewTaskTopic] = useState("")
  const [newTaskDuration, setNewTaskDuration] = useState("30")
  const [newTaskQuestions, setNewTaskQuestions] = useState("10")

  if (!user) return null

  const tasks = user.tasks || []
  const completedCount = tasks.filter((t) => t.completed).length
  const totalCount = tasks.length
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const handleToggleTask = (taskId: string) => {
    toggleTaskComplete(taskId)
  }

  const startEditing = (task: Task) => {
    setEditingTask(task.id)
    setTempTopic(task.topic)
    setTempDuration(task.duration.toString())
    setTempQuestions(task.questions.toString())
  }

  const saveEditing = (taskId: string) => {
    updateTask(taskId, {
      topic: tempTopic || tasks.find(t => t.id === taskId)?.topic || "",
      duration: Number.parseInt(tempDuration) || 30,
      questions: Number.parseInt(tempQuestions) || 10
    })
    setEditingTask(null)
  }

  const cancelEditing = () => {
    setEditingTask(null)
  }

  const handleAddTask = () => {
    if (!newTaskSubject || !newTaskTopic) return
    
    addTask({
      subject: newTaskSubject,
      topic: newTaskTopic,
      duration: Number.parseInt(newTaskDuration) || 30,
      questions: Number.parseInt(newTaskQuestions) || 10,
      completed: false
    })
    
    setNewTaskSubject("")
    setNewTaskTopic("")
    setNewTaskDuration("30")
    setNewTaskQuestions("10")
    setIsAddDialogOpen(false)
  }

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId)
    setEditingTask(null)
  }

  const getSubjectColor = (subject: string) => {
    const subj = SUBJECTS.find(s => s.value === subject)
    return subj?.color || "bg-gray-500/20 text-gray-400"
  }

  const today = new Date().toLocaleDateString("tr-TR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gunluk Takip</h1>
          <p className="text-muted-foreground">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-lg bg-primary/10 text-primary">
            <span className="font-bold">{completedCount}</span>
            <span className="text-muted-foreground">/{totalCount} Gorev</span>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Gorev Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Yeni Gorev Ekle</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Gunluk calisma planina yeni bir gorev ekle
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Ders</Label>
                  <Select value={newTaskSubject} onValueChange={setNewTaskSubject}>
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Ders secin" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {SUBJECTS.map(subj => (
                        <SelectItem key={subj.value} value={subj.value} className="text-foreground">
                          {subj.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Konu</Label>
                  <Input
                    value={newTaskTopic}
                    onChange={(e) => setNewTaskTopic(e.target.value)}
                    placeholder="ornek: Turev ve Integral"
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Sure (dk)</Label>
                    <Input
                      type="number"
                      value={newTaskDuration}
                      onChange={(e) => setNewTaskDuration(e.target.value)}
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Soru Sayisi</Label>
                    <Input
                      type="number"
                      value={newTaskQuestions}
                      onChange={(e) => setNewTaskQuestions(e.target.value)}
                      className="bg-input border-border text-foreground"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleAddTask} 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={!newTaskSubject || !newTaskTopic}
                >
                  Gorev Ekle
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Progress Card */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Gunluk Ilerleme</span>
            <span className="text-sm font-medium text-foreground">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {completedCount === totalCount && totalCount > 0 && (
            <p className="mt-3 text-center text-primary font-medium">
              Tebrikler! Bugunun tum gorevlerini tamamladin! +50 XP Bonus
            </p>
          )}
        </CardContent>
      </Card>

      {/* Tasks */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <Card className="bg-card/50 border-border/50">
            <CardContent className="py-12 text-center">
              <svg className="w-12 h-12 mx-auto mb-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-muted-foreground mb-4">Henuz gorev eklemediniz</p>
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Ilk Gorevini Ekle
              </Button>
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => (
            <Card
              key={task.id}
              className={`bg-card/50 border-border/50 transition-all ${
                task.completed ? "opacity-60" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    type="button"
                    onClick={() => handleToggleTask(task.id)}
                    className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                      task.completed
                        ? "bg-primary border-primary"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {task.completed && (
                      <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  {/* Task Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSubjectColor(task.subject)}`}>
                        {task.subject}
                      </span>
                      {editingTask === task.id ? (
                        <Input
                          value={tempTopic}
                          onChange={(e) => setTempTopic(e.target.value)}
                          className="h-7 text-sm bg-input border-border text-foreground flex-1"
                        />
                      ) : (
                        <h3 className={`font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {task.topic}
                        </h3>
                      )}
                    </div>

                    {/* Stats / Editing */}
                    {editingTask === task.id ? (
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={tempDuration}
                            onChange={(e) => setTempDuration(e.target.value)}
                            className="w-16 h-8 text-sm bg-input border-border text-foreground"
                          />
                          <span className="text-xs text-muted-foreground">dk</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={tempQuestions}
                            onChange={(e) => setTempQuestions(e.target.value)}
                            className="w-16 h-8 text-sm bg-input border-border text-foreground"
                          />
                          <span className="text-xs text-muted-foreground">soru</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => saveEditing(task.id)}
                            className="h-8 bg-primary hover:bg-primary/90 text-primary-foreground"
                          >
                            Kaydet
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEditing}
                            className="h-8 border-border text-muted-foreground bg-transparent"
                          >
                            Iptal
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteTask(task.id)}
                            className="h-8"
                          >
                            Sil
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {task.duration} dk
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {task.questions} soru
                        </span>
                        <button
                          type="button"
                          onClick={() => startEditing(task)}
                          className="text-primary hover:underline text-xs"
                        >
                          Duzenle
                        </button>
                      </div>
                    )}
                  </div>

                  {/* XP Badge */}
                  <div className="text-right">
                    <span className="text-xs text-accent font-medium">
                      +{task.questions + Math.floor(task.duration * 0.5)} XP
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Daily Summary */}
      {tasks.length > 0 && (
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Gunluk Ozet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-secondary/50">
                <p className="text-2xl font-bold text-foreground">
                  {tasks.filter((t) => t.completed).reduce((acc, t) => acc + t.duration, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Dakika</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-secondary/50">
                <p className="text-2xl font-bold text-foreground">
                  {tasks.filter((t) => t.completed).reduce((acc, t) => acc + t.questions, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Soru</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-secondary/50">
                <p className="text-2xl font-bold text-primary">{completedCount}</p>
                <p className="text-xs text-muted-foreground">Tamamlanan</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-secondary/50">
                <p className="text-2xl font-bold text-accent">
                  {tasks.filter((t) => t.completed).reduce((acc, t) => acc + t.questions + Math.floor(t.duration * 0.5), 0)}
                </p>
                <p className="text-xs text-muted-foreground">Kazanilan XP</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
