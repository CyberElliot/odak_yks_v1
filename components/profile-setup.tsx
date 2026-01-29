"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useUser } from "@/lib/user-context"

const GRADES = [
  { value: "9", label: "9. Sinif" },
  { value: "10", label: "10. Sinif" },
  { value: "11", label: "11. Sinif" },
  { value: "12", label: "12. Sinif" },
  { value: "mezun", label: "Mezun" }
]

const FIELDS = [
  { value: "sayisal", label: "Sayisal", description: "Matematik, Fizik, Kimya, Biyoloji" },
  { value: "esit", label: "Esit Agirlik", description: "Matematik, Turkce, Tarih, Cografya" },
  { value: "sozel", label: "Sozel", description: "Turkce, Tarih, Cografya, Felsefe" },
  { value: "dil", label: "Dil", description: "Yabanci Dil Agirlikli" }
]

const TARGETS = [
  { value: "derece", label: "Derece Hedefi", description: "Ilk 1000 - Yogun calisma programi", color: "text-destructive" },
  { value: "orta", label: "Orta Hedef", description: "1000-10000 arasi - Dengeli program", color: "text-accent" },
  { value: "hafif", label: "Hafif Hedef", description: "10000+ - Esnek calisma programi", color: "text-primary" }
]

interface ProfileSetupProps {
  onComplete: () => void
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const { user, updateProfile } = useUser()
  const [step, setStep] = useState(1)
  const [grade, setGrade] = useState(user?.grade || "")
  const [field, setField] = useState(user?.field || "")
  const [target, setTarget] = useState(user?.targetRank || "")

  const handleNext = () => {
    if (step === 1 && grade) {
      setStep(2)
    } else if (step === 2 && field) {
      setStep(3)
    } else if (step === 3 && target) {
      updateProfile({
        grade,
        field,
        targetRank: target
      })
      onComplete()
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <Card className="relative z-10 w-full max-w-lg bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full transition-all ${
                  s === step
                    ? "bg-primary w-8"
                    : s < step
                      ? "bg-primary"
                      : "bg-secondary"
                }`}
              />
            ))}
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            {step === 1 && "Sinif Secimi"}
            {step === 2 && "Alan Secimi"}
            {step === 3 && "Hedef Belirleme"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {step === 1 && "Hangi siniftasin?"}
            {step === 2 && "Hangi alanda calisacaksin?"}
            {step === 3 && "YKS hedefin nedir?"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Grade Selection */}
          {step === 1 && (
            <div className="space-y-3">
              {GRADES.map((g) => (
                <button
                  key={g.value}
                  type="button"
                  onClick={() => setGrade(g.value)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    grade === g.value
                      ? "bg-primary/10 border-primary text-foreground"
                      : "bg-secondary/50 border-border/50 text-foreground hover:border-border"
                  }`}
                >
                  <span className="font-medium">{g.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Field Selection */}
          {step === 2 && (
            <div className="space-y-3">
              {FIELDS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setField(f.value)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    field === f.value
                      ? "bg-primary/10 border-primary"
                      : "bg-secondary/50 border-border/50 hover:border-border"
                  }`}
                >
                  <span className="font-medium text-foreground">{f.label}</span>
                  <p className="text-sm text-muted-foreground mt-1">{f.description}</p>
                </button>
              ))}
            </div>
          )}

          {/* Step 3: Target Selection */}
          {step === 3 && (
            <div className="space-y-3">
              {TARGETS.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setTarget(t.value)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    target === t.value
                      ? "bg-primary/10 border-primary"
                      : "bg-secondary/50 border-border/50 hover:border-border"
                  }`}
                >
                  <span className={`font-medium ${t.color}`}>{t.label}</span>
                  <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
                </button>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 border-border text-foreground bg-transparent"
              >
                Geri
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={
                (step === 1 && !grade) ||
                (step === 2 && !field) ||
                (step === 3 && !target)
              }
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {step === 3 ? "Tamamla" : "Devam Et"}
            </Button>
          </div>

          {/* User Info */}
          <div className="mt-6 pt-4 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              Hos geldin, <span className="text-foreground font-medium">{user?.userName}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
