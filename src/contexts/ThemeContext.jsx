import { createContext, useState, useEffect, useContext } from 'react'

/**
 * EXPLICATION :
 * Ce Context gère le dark mode dans toute l'application
 * - Stocke l'état isDark (true/false)
 * - Persiste dans localStorage
 * - Applique automatiquement la classe 'dark' sur <html>
 */

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  // Initialiser depuis localStorage ou false par défaut
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      return saved === 'dark'
    }
    return false
  })

  // Appliquer le thème à chaque changement
  useEffect(() => {
    const root = document.documentElement // <html>
    
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  // Fonction pour basculer le thème
  const toggleTheme = () => {
    setIsDark(prev => !prev)
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook personnalisé pour utiliser le thème facilement
export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme doit être utilisé dans un ThemeProvider')
  }
  return context
}