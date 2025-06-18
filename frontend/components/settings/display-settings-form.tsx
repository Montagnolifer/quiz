'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useTheme } from '@/components/theme-provider'
import { toast } from '@/components/ui/use-toast'

interface DisplaySettingsFormProps {
  initialTheme: 'light' | 'dark' | 'system'
}

export function DisplaySettingsForm({ initialTheme }: DisplaySettingsFormProps) {
  const { setTheme } = useTheme()
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>(initialTheme)
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveSettings = async () => {
    setIsSaving(true)

    try {
      // Primeiro aplica o tema localmente
      setTheme(selectedTheme)

      // Agora salva na API NestJS
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          theme: selectedTheme,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Erro ao salvar o tema')
      }

      toast({
        title: 'Tema salvo!',
        description: 'Sua preferência de tema foi atualizada.',
      })
    } catch (error: any) {
      console.error('Erro ao salvar tema:', error)
      toast({
        title: 'Erro ao salvar tema',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Display</CardTitle>
        <CardDescription>Gerencie suas preferências de exibição.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="theme">Tema</Label>
          <RadioGroup
            id="theme"
            value={selectedTheme}
            onValueChange={(value) => setSelectedTheme(value as 'light' | 'dark' | 'system')}
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem value="light" id="light" className="sr-only peer" />
              <Label
                htmlFor="light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
              >
                Light
              </Label>
            </div>

            <div>
              <RadioGroupItem value="dark" id="dark" className="sr-only peer" />
              <Label
                htmlFor="dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
              >
                Dark
              </Label>
            </div>

            <div>
              <RadioGroupItem value="system" id="system" className="sr-only peer" />
              <Label
                htmlFor="system"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
              >
                System
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Salvar alterações'}
        </Button>
      </CardFooter>
    </Card>
  )
}
