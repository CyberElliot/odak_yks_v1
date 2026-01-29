"use client"

import { useState, useEffect } from "react"

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "Gunluk Takip",
    description: "Her gun programini takip et, gorevlerini tamamla",
    color: "text-primary"
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Pomodoro Timer",
    description: "Odaklanma surelerini yonet, verimliligini artir",
    color: "text-destructive"
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    title: "XP & Rank Sistemi",
    description: "Calisma puan kazan, seviye atla, odullerini al",
    color: "text-accent"
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "AI Asistan",
    description: "Yapay zeka destekli calisma kocu ve motivator",
    color: "text-chart-3"
  }
]

const ranks = [
  { name: "Yeni Baslayan", xp: 0, color: "from-gray-500 to-gray-600" },
  { name: "Caliskan", xp: 500, color: "from-green-500 to-green-600" },
  { name: "Azimli", xp: 1500, color: "from-blue-500 to-blue-600" },
  { name: "Odakli", xp: 3000, color: "from-purple-500 to-purple-600" },
  { name: "Profesyonel", xp: 5000, color: "from-yellow-500 to-yellow-600" },
  { name: "Uzman", xp: 8000, color: "from-orange-500 to-orange-600" },
  { name: "Usta", xp: 12000, color: "from-red-500 to-red-600" },
  { name: "Efsane", xp: 18000, color: "from-pink-500 to-pink-600" },
  { name: "YKS Savascisi", xp: 25000, color: "from-cyan-500 to-cyan-600" },
  { name: "YKS Bukucusu", xp: 35000, color: "from-amber-400 to-amber-600" }
]

export function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [animatedXP, setAnimatedXP] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const targetXP = 2847
    const duration = 2000
    const steps = 60
    const increment = targetXP / steps
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= targetXP) {
        setAnimatedXP(targetXP)
        clearInterval(timer)
      } else {
        setAnimatedXP(Math.floor(current))
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-8">
      {/* Hero Text */}
      <div className="text-center lg:text-left">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight text-balance">
          Hedefine
          <span className="block text-primary">Odaklan</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 text-pretty">
          ODAKyks ile gunluk takip, pomodoro, XP sistemi ve yapay zeka destekli kisisel calisma asistani ile hedefine bir adim daha yakin.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
              activeFeature === index
                ? "bg-secondary border-primary/50 scale-105"
                : "bg-card/30 border-border/50 hover:border-border"
            }`}
            onClick={() => setActiveFeature(index)}
          >
            <div className={`${feature.color} mb-2`}>{feature.icon}</div>
            <h3 className="font-semibold text-foreground text-sm">{feature.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* XP Preview Card */}
      <div className="p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Ornek Profil</p>
            <h3 className="text-xl font-bold text-foreground">Ahmet Y.</h3>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Toplam XP</p>
            <p className="text-2xl font-bold text-accent">{animatedXP.toLocaleString()}</p>
          </div>
        </div>
        
        {/* Rank Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className={`font-semibold bg-gradient-to-r ${ranks[2].color} bg-clip-text text-transparent`}>
              {ranks[2].name}
            </span>
            <span className="text-muted-foreground">
              {ranks[3].xp - animatedXP} XP kaldi
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${ranks[2].color} transition-all duration-1000`}
              style={{ width: `${((animatedXP - ranks[2].xp) / (ranks[3].xp - ranks[2].xp)) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{ranks[2].xp} XP</span>
            <span>{ranks[3].xp} XP</span>
          </div>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border/50">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">47</p>
            <p className="text-xs text-muted-foreground">Gun Serisi</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">1,284</p>
            <p className="text-xs text-muted-foreground">Cozulen Soru</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">156</p>
            <p className="text-xs text-muted-foreground">Saat</p>
          </div>
        </div>
      </div>
    </div>
  )
}
