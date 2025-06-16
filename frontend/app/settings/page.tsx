'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileSettingsForm } from '@/components/settings/profile-settings-form'
import { PasswordChangeForm } from '@/components/settings/password-change-form'
import { NotificationSettingsForm } from '@/components/settings/notification-settings-form'
import { DisplaySettingsForm } from '@/components/settings/display-settings-form'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const fetchUser = async () => {
      const res = await fetch('http://localhost:3005/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.status === 401) {
        router.push('/login')
        return
      }

      const data = await res.json()
      setUser(data)
      setLoading(false)
    }

    fetchUser()
  }, [router])

  if (loading) {
    return <div>Loading settings...</div>
  }

  const notificationSettings = user.settings?.notifications || {
    quizCompletions: true,
    newResults: true,
    marketing: false,
  }

  const theme = user.theme || 'system'

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile information and photo</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileSettingsForm user={user} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            {/* <CardContent>
                <PasswordChangeForm userId={user.id} />
            </CardContent> */}
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure which emails you want to receive</CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationSettingsForm initialSettings={notificationSettings} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Select your preferred theme</CardDescription>
            </CardHeader>
            <CardContent>
              <DisplaySettingsForm initialTheme={theme} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
