import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, User, ChevronDown } from 'lucide-react'
import { useSidebar } from '../../contexts/SidebarContext'
import DarkModeToggle from './DarkModeToggle'

/**
 * EXPLICATION :
 * Header de l'application avec barre supérieure
 * 
 * FONCTIONNALITÉS :
 * - Bouton hamburger (☰) pour ouvrir/fermer le sidebar
 * - Titre de la page courante (dynamique)
 * - Toggle dark mode (soleil/lune)
 * - Menu utilisateur avec dropdown
 *   - Avatar
 *   - Nom de l'utilisateur
 *   - Menu : Profil, Paramètres, Déconnexion
 * - Sticky : reste en haut lors du scroll
 * 
 * RESPONSIVE :
 * - Mobile : nom utilisateur caché
 * - Desktop : tout visible
 */

export default function Header({ pageTitle = 'Dashboard' }) {
  const { toggle } = useSidebar()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Récupérer les infos utilisateur depuis localStorage
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}')
    } catch {
      return {}
    }
  })()

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-md">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Gauche : Bouton hamburger + Titre */}
        <div className="flex items-center gap-4">
          {/* Bouton hamburger pour ouvrir/fermer le sidebar */}
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Toggle menu"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          
          {/* Titre de la page */}
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {pageTitle}
          </h1>
        </div>

        {/* Droite : Dark Mode + Menu Utilisateur */}
        <div className="flex items-center gap-4">
          {/* Toggle Dark Mode */}
          <DarkModeToggle />
          
          {/* Menu utilisateur avec dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-expanded={showUserMenu}
              aria-haspopup="true"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              {/* Nom utilisateur : caché sur mobile */}
              <span className="hidden md:block font-medium text-gray-700 dark:text-gray-300">
                {user.name || 'Utilisateur'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <>
                {/* Overlay invisible pour fermer le dropdown */}
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                  aria-hidden="true"
                />
                
                {/* Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-20">
                  <button
                    onClick={() => {
                      navigate('/profile')
                      setShowUserMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    Mon profil
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings')
                      setShowUserMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    Paramètres
                  </button>
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 transition-colors"
                  >
                    Déconnexion
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}