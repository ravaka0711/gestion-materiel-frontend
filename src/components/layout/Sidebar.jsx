import { useNavigate, useLocation } from 'react-router-dom'
import { 
  X, 
  Home, 
  Wrench, 
  Monitor, 
  Package, 
  Building2, 
  MapPin,
  LogOut 
} from 'lucide-react'
import { useSidebar } from '../../contexts/SidebarContext'

/**
 * EXPLICATION :
 * Sidebar de navigation avec menu latéral
 * 
 * FONCTIONNALITÉS :
 * - Navigation vers 6 pages principales
 * - Logo Paositra Malagasy en haut
 * - Icônes pour chaque menu
 * - Highlight de la page active
 * - Bouton de déconnexion en bas
 * - Responsive : drawer sur mobile, fixe sur desktop
 * - Animation slide-in/slide-out
 * - Overlay pour fermer sur mobile
 * 
 * RESPONSIVE :
 * - Mobile : sidebar en overlay, ferme après navigation
 * - Desktop : sidebar fixe, toujours visible
 */

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isOpen, close } = useSidebar()

  // Configuration des liens de navigation
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/maintenances', label: 'Maintenances', icon: Wrench },
    { path: '/materiels', label: 'Matériels', icon: Monitor },
    { path: '/logiciels', label: 'Logiciels', icon: Package },
    { path: '/agences', label: 'Agences', icon: Building2 },
    { path: '/regions', label: 'Régions', icon: MapPin },
  ]

  // Fonction de navigation
  const handleNavigation = (path) => {
    navigate(path)
    close() // Fermer le sidebar sur mobile après navigation
  }

  // Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <>
      {/* Overlay sur mobile : fond sombre cliquable pour fermer le sidebar */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* En-tête avec logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              Paositra
            </span>
          </div>
          {/* Bouton fermer : visible uniquement sur mobile */}
          <button
            onClick={close}
            className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation principale */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-all duration-200 font-medium
                      ${isActive 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bouton de déconnexion en bas */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  )
}