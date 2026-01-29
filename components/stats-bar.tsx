"use client"

import { useEffect, useState } from "react"

export function StatsBar() {
  const [daysLeft, setDaysLeft] = useState(0)
  
  useEffect(() => {
    // YKS 2026 tarihi (yaklaşık Haziran ortası)
    const yksDate = new Date("2026-06-13")
    const today = new Date()
    const diffTime = yksDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    setDaysLeft(diffDays > 0 ? diffDays : 0)
  }, [])

  return (
    <div className="hidden sm:flex items-center gap-4">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/50">
        <svg className="w-4 h-4 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium text-foreground">
          <span className="text-destructive font-bold">{daysLeft}</span> gun kaldi
        </span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border/50">
        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span className="text-sm font-medium text-foreground">
          <span className="text-primary font-bold">12.4K</span> ogrenci
        </span>
      </div>
    </div>
  )
}
