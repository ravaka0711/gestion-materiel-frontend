import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, User, ChevronDown } from 'lucide-react'
import { useSidebar } from '../../contexts/SidebarContext'
import DarkModeToggle from './DarkModeToggle'

export default function Header() {
  const { toggle, isOpen } = useSidebar()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    console.log('Header - État isOpen changé:', isOpen)
  }, [isOpen])

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}')
    } catch {
      return {}
    }
  })()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/home')
  }

  const handleToggleSidebar = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggle()
  }

  return (
    <header style={{border: 0, boxShadow: 'none'}} className="bg-white dark:bg-gray-800">
      <div className={`flex items-center justify-between ${isOpen ? 'px-3' : 'px-2'} py-3`}>
        <div className="flex items-center gap-4">
          <button
            onClick={handleToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Toggle menu"
            aria-label="Ouvrir/Fermer le menu"
            type="button"
          >
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <DarkModeToggle />
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-expanded={showUserMenu}
              aria-haspopup="true"
              type="button"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="hidden md:block font-medium text-gray-700 dark:text-gray-300">
                {user.name || 'Utilisateur'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                  aria-hidden="true"
                />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-20">
                  <button
                    onClick={() => {
                      navigate('/profile')
                      setShowUserMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                    type="button"
                  >
                    Mon profil
                  </button>
                  <button
                    onClick={() => {
                      navigate('/settings')
                      setShowUserMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                    type="button"
                  >
                    Paramètres
                  </button>
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 transition-colors"
                    type="button"
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
