'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

interface NotificationSettings {
  quizCompletions: boolean
  newResults: boolean
  marketing: boolean
}

interface NotificationSettingsFormProps {
  initialSettings: NotificationSettings
}

export function NotificationSettingsForm({ initialSettings }: NotificationSettingsFormProps) {
  const [settings, setSettings] = useState<NotificationSettings>(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          settings: {
            notifications: settings,
          },
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Erro ao salvar configurações')
      }

      toast({
        title: 'Preferências salvas',
        description: 'Suas preferências de notificação foram atualizadas.',
      })
    } catch (error: any) {
      console.error('Erro ao salvar preferências:', error)
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="quiz-completions">Quiz Completions</Label>
            <p className="text-sm text-muted-foreground">Receba notificações quando alguém concluir seu quiz</p>
          </div>
          <Switch
            id="quiz-completions"
            checked={settings.quizCompletions}
            onCheckedChange={(checked) => setSettings({ ...settings, quizCompletions: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="new-results">New Results</Label>
            <p className="text-sm text-muted-foreground">Seja avisado sobre novos resultados e análises</p>
          </div>
          <Switch
            id="new-results"
            checked={settings.newResults}
            onCheckedChange={(checked) => setSettings({ ...settings, newResults: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="marketing">Marketing</Label>
            <p className="text-sm text-muted-foreground">Receba emails sobre novidades e ofertas</p>
          </div>
          <Switch
            id="marketing"
            checked={settings.marketing}
            onCheckedChange={(checked) => setSettings({ ...settings, marketing: checked })}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Salvar Preferências'}
        </Button>
      </div>
    </form>
  )
}
