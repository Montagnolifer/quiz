import { DisplaySettingsForm } from "@/components/settings/display-settings-form"

export const metadata = {
  title: "Display Settings",
  description: "Manage your display preferences.",
}

export default function DisplaySettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Display Settings</h3>
        <p className="text-sm text-muted-foreground">Customize how the application looks and feels.</p>
      </div>
      <DisplaySettingsForm />
    </div>
  )
}
