"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser, RANKS } from "@/lib/user-context"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const GRADES = [
  { value: "9", label: "9. Sinif" },
  { value: "10", label: "10. Sinif" },
  { value: "11", label: "11. Sinif" },
  { value: "12", label: "12. Sinif" },
  { value: "mezun", label: "Mezun" }
]

const FIELDS = [
  { value: "sayisal", label: "Sayisal (MF)" },
  { value: "esit-agirlik", label: "Esit Agirlik (TM)" },
  { value: "sozel", label: "Sozel (TS)" },
  { value: "dil", label: "Yabanci Dil" }
]

const TARGET_RANKS = [
  { value: "ilk-1000", label: "Ilk 1.000" },
  { value: "ilk-5000", label: "Ilk 5.000" },
  { value: "ilk-10000", label: "Ilk 10.000" },
  { value: "ilk-50000", label: "Ilk 50.000" },
  { value: "ilk-100000", label: "Ilk 100.000" },
  { value: "yerlesme", label: "Herhangi Bir Yerlesme" }
]

export function ProfilePanel() {
  const { user, updateProfile } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    userName: "",
    grade: "",
    field: "",
    targetRank: "",
    targetUniversity: "",
    targetDepartment: "",
    dailyStudyGoal: 4
  })

  if (!user) return null

  const currentRank = RANKS[user.currentRank]
  const nextRank = RANKS[user.currentRank + 1]

  const startEditing = () => {
    setFormData({
      userName: user.userName,
      grade: user.grade,
      field: user.field,
      targetRank: user.targetRank,
      targetUniversity: user.targetUniversity || "",
      targetDepartment: user.targetDepartment || "",
      dailyStudyGoal: user.dailyStudyGoal || 4
    })
    setIsEditing(true)
  }

  const saveProfile = () => {
    updateProfile({
      userName: formData.userName,
      grade: formData.grade,
      field: formData.field,
      targetRank: formData.targetRank,
      targetUniversity: formData.targetUniversity,
      targetDepartment: formData.targetDepartment,
      dailyStudyGoal: formData.dailyStudyGoal
    })
    setIsEditing(false)
  }

  const cancelEditing = () => {
    setIsEditing(false)
  }

  // Calculate days until YKS (approximate - June 2026)
  const yksDate = new Date("2026-06-20")
  const today = new Date()
  const daysUntilYKS = Math.ceil((yksDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profil</h1>
          <p className="text-muted-foreground">Hesap bilgilerini ve hedeflerini yonet</p>
        </div>
        {!isEditing && (
          <Button onClick={startEditing} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Duzenle
          </Button>
        )}
      </div>

      {/* Profile Card */}
      <Card className="bg-card/50 border-border/50 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-background/50 flex items-center justify-center text-primary font-bold text-3xl">
              {user.userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">{user.userName}</h2>
              <p className="text-accent">{currentRank.name}</p>
              <p className="text-sm text-muted-foreground mt-1">Kod: {user.userCode}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-accent">{user.totalXP.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Toplam XP</p>
            </div>
          </div>
          
          {nextRank && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Sonraki Rank: {nextRank.name}</span>
                <span className="text-foreground">{(nextRank.minXP - user.totalXP).toLocaleString()} XP kaldi</span>
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

      {/* YKS Countdown */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-destructive/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">YKS 2026 Geri Sayim</p>
                <p className="text-3xl font-bold text-foreground">{daysUntilYKS} Gun</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Tahmini Tarih</p>
              <p className="text-lg font-medium text-foreground">20 Haziran 2026</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      {isEditing ? (
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Profil Bilgilerini Duzenle</CardTitle>
            <CardDescription className="text-muted-foreground">
              Hedeflerini ve bilgilerini guncelleyebilirsin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">Isim</Label>
              <Input
                value={formData.userName}
                onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                className="bg-input border-border text-foreground"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Sinif</Label>
                <Select 
                  value={formData.grade} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Sinif secin" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {GRADES.map(g => (
                      <SelectItem key={g.value} value={g.value} className="text-foreground">
                        {g.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-foreground">Alan</Label>
                <Select 
                  value={formData.field} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, field: value }))}
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Alan secin" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {FIELDS.map(f => (
                      <SelectItem key={f.value} value={f.value} className="text-foreground">
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-foreground">Hedef Siralama</Label>
              <Select 
                value={formData.targetRank} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, targetRank: value }))}
              >
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Hedef secin" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {TARGET_RANKS.map(t => (
                    <SelectItem key={t.value} value={t.value} className="text-foreground">
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-foreground">Hedef Universite</Label>
              <Input
                value={formData.targetUniversity}
                onChange={(e) => setFormData(prev => ({ ...prev, targetUniversity: e.target.value }))}
                placeholder="ornek: Istanbul Teknik Universitesi"
                className="bg-input border-border text-foreground"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-foreground">Hedef Bolum</Label>
              <Input
                value={formData.targetDepartment}
                onChange={(e) => setFormData(prev => ({ ...prev, targetDepartment: e.target.value }))}
                placeholder="ornek: Bilgisayar Muhendisligi"
                className="bg-input border-border text-foreground"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-foreground">Gunluk Calisma Hedefi (saat)</Label>
              <Input
                type="number"
                value={formData.dailyStudyGoal}
                onChange={(e) => setFormData(prev => ({ ...prev, dailyStudyGoal: Number.parseInt(e.target.value) || 4 }))}
                min={1}
                max={16}
                className="bg-input border-border text-foreground"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button onClick={saveProfile} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                Kaydet
              </Button>
              <Button onClick={cancelEditing} variant="outline" className="flex-1 border-border text-muted-foreground bg-transparent">
                Iptal
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-foreground">Profil Bilgileri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Sinif</p>
                <p className="font-medium text-foreground">
                  {user.grade ? (user.grade === "mezun" ? "Mezun" : `${user.grade}. Sinif`) : "Belirtilmedi"}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Alan</p>
                <p className="font-medium text-foreground capitalize">
                  {FIELDS.find(f => f.value === user.field)?.label || "Belirtilmedi"}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Hedef Siralama</p>
                <p className="font-medium text-foreground">
                  {TARGET_RANKS.find(t => t.value === user.targetRank)?.label || "Belirtilmedi"}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Gunluk Hedef</p>
                <p className="font-medium text-foreground">{user.dailyStudyGoal || 4} saat</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Hedef Universite</p>
                <p className="font-medium text-foreground">{user.targetUniversity || "Belirtilmedi"}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50 col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Hedef Bolum</p>
                <p className="font-medium text-foreground">{user.targetDepartment || "Belirtilmedi"}</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Kayit Tarihi</p>
                <p className="font-medium text-foreground">
                  {new Date(user.createdAt).toLocaleDateString("tr-TR")}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Kayit Kodu</p>
                <p className="font-medium text-foreground">{user.userCode}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-foreground">Basarilar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg text-center ${user.totalXP >= 100 ? "bg-primary/20" : "bg-secondary/30 opacity-50"}`}>
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground">Ilk Adim</p>
              <p className="text-xs text-muted-foreground">100 XP Kazan</p>
            </div>
            <div className={`p-4 rounded-lg text-center ${user.totalXP >= 1000 ? "bg-accent/20" : "bg-secondary/30 opacity-50"}`}>
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-accent/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground">Caliskan</p>
              <p className="text-xs text-muted-foreground">1000 XP Kazan</p>
            </div>
            <div className={`p-4 rounded-lg text-center ${(user.tasks?.filter(t => t.completed).length || 0) >= 10 ? "bg-chart-3/20" : "bg-secondary/30 opacity-50"}`}>
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-chart-3/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-chart-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground">Gorev Ustasi</p>
              <p className="text-xs text-muted-foreground">10 Gorev Tamamla</p>
            </div>
            <div className={`p-4 rounded-lg text-center ${user.currentRank >= 5 ? "bg-destructive/20" : "bg-secondary/30 opacity-50"}`}>
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-destructive/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground">Uzman</p>
              <p className="text-xs text-muted-foreground">Rank 6 Ulaş</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
