"use client"

import React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/lib/user-context"

interface LoginFormProps {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export function LoginForm({ isLoading, setIsLoading }: LoginFormProps) {
  const router = useRouter()
  const { login, register } = useUser()
  const [userCode, setUserCode] = useState("")
  const [userName, setUserName] = useState("")
  const [newUserCode, setNewUserCode] = useState("")
  const [newUserName, setNewUserName] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    const success = await login(userCode, userName)
    
    if (success) {
      router.push("/dashboard")
    } else {
      setError("Kullanici kodu veya isim hatali. Kayitli degilseniz 'Kayit Ol' sekmesini kullanin.")
    }
    setIsLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!newUserCode.trim() || !newUserName.trim()) {
      setError("Lutfen tum alanlari doldurun.")
      return
    }
    
    setIsLoading(true)
    
    const success = await register(newUserCode, newUserName)
    
    if (success) {
      router.push("/dashboard")
    } else {
      setError("Gecersiz veya zaten kullanilan kayit kodu. Lutfen size verilen kayit kodunu dogru girin.")
    }
    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <Image 
            src="/logo.png" 
            alt="ODAKyks Logo" 
            width={180} 
            height={60}
            className="h-14 w-auto"
          />
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">Hos Geldin!</CardTitle>
        <CardDescription className="text-muted-foreground">
          YKS yolculuguna baslamak icin giris yap veya kayit ol
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}
        
        <Tabs defaultValue="login" className="w-full" onValueChange={() => setError("")}>
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary">
            <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Giris Yap
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Kayit Ol
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userCode" className="text-foreground">Kullanici Kodu</Label>
                <Input
                  id="userCode"
                  placeholder="ornek: ODAK2026A1"
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value.toUpperCase())}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground uppercase"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userName" className="text-foreground">Isim</Label>
                <Input
                  id="userName"
                  placeholder="Adinizi girin"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Giris Yapiliyor...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Giris Yap
                  </span>
                )}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newUserCode" className="text-foreground">Kayit Kodu</Label>
                <Input
                  id="newUserCode"
                  placeholder="Size verilen kodu girin"
                  value={newUserCode}
                  onChange={(e) => setNewUserCode(e.target.value.toUpperCase())}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground uppercase"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Size verilen ozel kayit kodunu girin (ornek: ODAK2026A1)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newUserName" className="text-foreground">Isim</Label>
                <Input
                  id="newUserName"
                  placeholder="Adinizi girin"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Kayit Yapiliyor...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Kayit Ol ve Basla
                  </span>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Quick Info */}
        <div className="mt-6 pt-6 border-t border-border/50">
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Guvenli Giris
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Ozel Kod Sistemi
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
