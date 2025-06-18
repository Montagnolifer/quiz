"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Undo } from "lucide-react"
import { type ThemeSettings, defaultTheme } from "@/types/theme"
import ThemePreview from "./theme-preview"
import { Textarea } from "@/components/ui/textarea"

type ThemeCustomizerProps = {
  quizId: string
}

import { useEffect } from "react"


export default function ThemeCustomizer({ quizId }: ThemeCustomizerProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Theme settings
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme)
const [initialTitle, setInitialTitle] = useState<string>("")

useEffect(() => {
  async function fetchQuiz() {
    const token = localStorage.getItem("token")
    if (!token) {
      setError("Usuário não autenticado")
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error("Erro ao carregar quiz")

      const data = await res.json()
      setTheme(data.theme_settings || defaultTheme)
      setInitialTitle(data.title || "")
    } catch (err: any) {
      setError(err.message || "Erro ao carregar quiz")
    }
  }

  fetchQuiz()
}, [quizId])


  // Handle theme changes
  const handleColorChange = (key: keyof ThemeSettings, value: string) => {
    setTheme((prev) => ({ ...prev, [key]: value }))
  }

  const handleSliderChange = (key: keyof ThemeSettings, value: number[]) => {
    setTheme((prev) => ({ ...prev, [key]: value[0] }))
  }

  const handleSelectChange = (key: keyof ThemeSettings, value: string) => {
    setTheme((prev) => ({ ...prev, [key]: value }))
  }

  // Reset to default theme
  const resetTheme = () => {
    setTheme(defaultTheme)
  }

  // Save theme settings
  const saveTheme = async () => {
    const token = localStorage.getItem("token")
    if (!token) return
  
    setLoading(true)
    setError(null)
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quizId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          theme_settings: theme,
        }),
      })
  
      if (!res.ok) throw new Error("Erro ao salvar tema")
  
      setSuccess("Tema salvo com sucesso")
      setTimeout(() => setSuccess(null), 3005)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }  

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/dashboard/quizzes")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quizzes
            </Button>
            <h1 className="text-3xl font-bold">Customize Quiz</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={resetTheme}>
              <Undo className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={saveTheme} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              Save Theme
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customization Panel */}
          <div>
            <Tabs defaultValue="colors">
              <TabsList className="mb-4">
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="typography">Typography</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="scripts">Scripts</TabsTrigger>
              </TabsList>

              <TabsContent value="colors" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Color Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="backgroundColor">Background Color</Label>
                      <div className="flex gap-2">
                        <div className="w-10 h-10 rounded border" style={{ backgroundColor: theme.backgroundColor }} />
                        <Input
                          id="backgroundColor"
                          type="text"
                          value={theme.backgroundColor}
                          onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardColor">Card Color</Label>
                      <div className="flex gap-2">
                        <div className="w-10 h-10 rounded border" style={{ backgroundColor: theme.cardColor }} />
                        <Input
                          id="cardColor"
                          type="text"
                          value={theme.cardColor}
                          onChange={(e) => handleColorChange("cardColor", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="buttonColor">Button Color</Label>
                      <div className="flex gap-2">
                        <div className="w-10 h-10 rounded border" style={{ backgroundColor: theme.buttonColor }} />
                        <Input
                          id="buttonColor"
                          type="text"
                          value={theme.buttonColor}
                          onChange={(e) => handleColorChange("buttonColor", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="buttonTextColor">Button Text Color</Label>
                      <div className="flex gap-2">
                        <div className="w-10 h-10 rounded border" style={{ backgroundColor: theme.buttonTextColor }} />
                        <Input
                          id="buttonTextColor"
                          type="text"
                          value={theme.buttonTextColor}
                          onChange={(e) => handleColorChange("buttonTextColor", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="textColor">Text Color</Label>
                      <div className="flex gap-2">
                        <div className="w-10 h-10 rounded border" style={{ backgroundColor: theme.textColor }} />
                        <Input
                          id="textColor"
                          type="text"
                          value={theme.textColor}
                          onChange={(e) => handleColorChange("textColor", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="headerColor">Header Color</Label>
                      <div className="flex gap-2">
                        <div className="w-10 h-10 rounded border" style={{ backgroundColor: theme.headerColor }} />
                        <Input
                          id="headerColor"
                          type="text"
                          value={theme.headerColor}
                          onChange={(e) => handleColorChange("headerColor", e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="typography" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Typography Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fontFamily">Font Family</Label>
                      <Select
                        value={theme.fontFamily}
                        onValueChange={(value) => handleSelectChange("fontFamily", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select font family" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter, sans-serif">Inter</SelectItem>
                          <SelectItem value="'Roboto', sans-serif">Roboto</SelectItem>
                          <SelectItem value="'Open Sans', sans-serif">Open Sans</SelectItem>
                          <SelectItem value="'Montserrat', sans-serif">Montserrat</SelectItem>
                          <SelectItem value="'Poppins', sans-serif">Poppins</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="layout" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Layout Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="borderRadius">Border Radius: {theme.borderRadius}rem</Label>
                      <Slider
                        id="borderRadius"
                        min={0}
                        max={2}
                        step={0.125}
                        value={[theme.borderRadius]}
                        onValueChange={(value) => handleSliderChange("borderRadius", value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="scripts" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Scripts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="customHeadCode">Head Code</Label>
                      <Textarea
                        id="customHeadCode"
                        value={theme.customHeadCode || ""}
                        onChange={(e) => setTheme((prev) => ({ ...prev, customHeadCode: e.target.value }))}
                        placeholder="<!-- Add code to be inserted in the <head> tag -->"
                        rows={6}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        This code will be inserted inside the &lt;head&gt; tag of your quiz. Useful for meta tags,
                        analytics, or tracking scripts.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customBodyCode">Body Code</Label>
                      <Textarea
                        id="customBodyCode"
                        value={theme.customBodyCode || ""}
                        onChange={(e) => setTheme((prev) => ({ ...prev, customBodyCode: e.target.value }))}
                        placeholder="<!-- Add code to be inserted before the closing </body> tag -->"
                        rows={6}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        This code will be inserted just before the closing &lt;/body&gt; tag. Ideal for scripts like
                        Facebook Pixel, chat widgets, etc.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Panel */}
          <div className="sticky top-8">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
              <ThemePreview theme={theme} quizTitle={initialTitle} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
