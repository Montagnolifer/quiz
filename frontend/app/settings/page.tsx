import { createServerSupabaseClient } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileSettingsForm } from "@/components/settings/profile-settings-form"
import { PasswordChangeForm } from "@/components/settings/password-change-form"
import { NotificationSettingsForm } from "@/components/settings/notification-settings-form"
import { DisplaySettingsForm } from "@/components/settings/display-settings-form"

export default async function SettingsPage() {
  const supabase = createServerSupabaseClient()

  // Verificar se o usuário está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch user preferences
  const { data: preferences } = await supabase
    .from("user_preferences")
    .select("*")
    .eq("user_id", session.user.id)
    .single()

  // Default preferences if none exist
  const notificationSettings = preferences?.notification_settings || {
    quizCompletions: true,
    newResults: true,
    marketing: false,
  }

  const theme = preferences?.theme || "system"

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

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your profile information and photo</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileSettingsForm user={session.user} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordChangeForm />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure which emails you want to receive</CardDescription>
            </CardHeader>
            <CardContent>
              <NotificationSettingsForm initialSettings={notificationSettings} userId={session.user.id} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Tab */}
        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Select your preferred theme</CardDescription>
            </CardHeader>
            <CardContent>
              <DisplaySettingsForm initialTheme={theme} userId={session.user.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
