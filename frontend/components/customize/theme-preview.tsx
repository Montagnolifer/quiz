"use client"

import type { ThemeSettings } from "@/types/theme"

type ThemePreviewProps = {
  theme: ThemeSettings
  quizTitle: string
}

export default function ThemePreview({ theme, quizTitle }: ThemePreviewProps) {
  const previewStyles = {
    container: {
      backgroundColor: theme.backgroundColor,
      fontFamily: theme.fontFamily,
      color: theme.textColor,
      padding: "1.5rem",
      borderRadius: `${theme.borderRadius}rem`,
      minHeight: "500px",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
    },
    card: {
      backgroundColor: theme.cardColor,
      borderRadius: `${theme.borderRadius}rem`,
      padding: "1.5rem",
      width: "100%",
      maxWidth: "400px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
    header: {
      color: theme.headerColor,
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "1rem",
      textAlign: "center" as const,
    },
    question: {
      marginBottom: "1.5rem",
      textAlign: "center" as const,
    },
    option: {
      backgroundColor: "white",
      border: "1px solid #e5e7eb",
      borderRadius: `${theme.borderRadius}rem`,
      padding: "0.75rem",
      marginBottom: "0.75rem",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    optionSelected: {
      backgroundColor: `${theme.buttonColor}20`,
      borderColor: theme.buttonColor,
    },
    button: {
      backgroundColor: theme.buttonColor,
      color: theme.buttonTextColor,
      borderRadius: `${theme.borderRadius}rem`,
      padding: "0.5rem 1rem",
      border: "none",
      cursor: "pointer",
      fontWeight: "500",
      width: "100%",
      marginTop: "1rem",
    },
    progressBar: {
      width: "100%",
      height: "0.5rem",
      backgroundColor: "#e5e7eb",
      borderRadius: "9999px",
      marginBottom: "1rem",
    },
    progressFill: {
      width: "60%",
      height: "100%",
      backgroundColor: theme.buttonColor,
      borderRadius: "9999px",
    },
  }

  return (
    <div style={previewStyles.container}>
      <div style={previewStyles.card}>
        <div style={previewStyles.progressBar}>
          <div style={previewStyles.progressFill}></div>
        </div>
        <h2 style={previewStyles.header}>{quizTitle}</h2>
        <div style={previewStyles.question}>What is your favorite color?</div>
        <div style={previewStyles.option}>Red</div>
        <div style={{ ...previewStyles.option, ...previewStyles.optionSelected }}>Blue</div>
        <div style={previewStyles.option}>Green</div>
        <div style={previewStyles.option}>Yellow</div>
        <button style={previewStyles.button}>Next</button>
      </div>
    </div>
  )
}
