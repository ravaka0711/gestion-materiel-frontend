import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'

/**
 * EXPLICATION :
 * Composant bouton pour basculer entre mode clair et sombre
 * - Affiche une icône Soleil en mode sombre
 * - Affiche une icône Lune en mode clair
 * - Utilise le ThemeContext pour changer le thème
 */

export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      title={isDark ? 'Mode clair' : 'Mode sombre'}
      aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  )
}