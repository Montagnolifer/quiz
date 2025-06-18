'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

interface ProfileSettingsFormProps {
  user: {
    id: number
    name: string
    email: string
    theme?: string
    settings?: any
  }
}

export function ProfileSettingsForm({ user }: ProfileSettingsFormProps) {
  const [name, setName] = useState(user.name || '')
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
        body: JSON.stringify({ name }),
      })

      if (!res.ok) throw new Error('Erro ao atualizar perfil')

      toast({
        title: 'Perfil atualizado!',
        description: 'Suas informações foram salvas com sucesso.',
      })
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      toast({
        title: 'Falha na atualização',
        description: 'Não foi possível atualizar seu perfil.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={user.email} disabled />
        <p className="text-sm text-muted-foreground">Seu email é usado para login e não pode ser alterado.</p>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </div>
    </form>
  )
}
