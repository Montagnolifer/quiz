export type ThemeSettings = {
  backgroundColor: string
  cardColor: string
  buttonColor: string
  buttonTextColor: string
  textColor: string
  borderRadius: number
  fontFamily: string
  headerColor: string
  customHeadCode?: string
  customBodyCode?: string
}

export const defaultTheme: ThemeSettings = {
  backgroundColor: "#fce7f3", // pink-100
  cardColor: "#ffffff",
  buttonColor: "#ec4899", // pink-500
  buttonTextColor: "#ffffff",
  textColor: "#111827", // gray-900
  borderRadius: 0.75, // rem
  fontFamily: "Inter, sans-serif",
  headerColor: "#be185d", // pink-700
  customHeadCode: "",
  customBodyCode: "",
}
