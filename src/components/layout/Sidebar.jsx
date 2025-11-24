import { 
  X, Home, Wrench, Monitor, Package, Building2, MapPin, Users, LogOut, Eye 
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSidebar } from '../../contexts/SidebarContext'
import ConfirmDialog from '../common/ConfirmDialog'
import logoPaositra from '../../assets/logo-paositra.jpg'

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isOpen, close } = useSidebar()
  const [showConfirmLogout, setShowConfirmLogout] = useState(false)

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isResponsable = user.fonction === 'responsable'
  const isDirecteur = user.fonction === 'directeur'

  // Navigation selon le rôle
  const navItems = isDirecteur ? [
    { path: '/dashboard/directeur', label: 'Dashboard', icon: Home },
    { path: '/regions', label: 'Régions', icon: MapPin },
    { path: '/agences', label: 'Agences', icon: Building2 },
    { path: '/materiels', label: 'Matériels', icon: Monitor },
  ] : [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/maintenances', label: 'Maintenances', icon: Wrench },
    { path: '/materiels', label: 'Matériels', icon: Monitor },
    { path: '/logiciels', label: 'Logiciels', icon: Package },
    { path: '/agences', label: 'Agences', icon: Building2 },
    { path: '/regions', label: 'Régions', icon: MapPin },
    { path: '/utilisateurs', label: 'Utilisateurs', icon: Users },
  ]

  const handleNavigation = (path) => {
    navigate(path)
    if (window.innerWidth < 1024) close()
  }

  // Fonction réelle de déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <aside
        style={{ width: isOpen ? '256px' : '80px' }}
        className={`
          fixed lg:fixed top-0 left-0 bottom-0 bg-white dark:bg-gray-800 shadow-xl z-40
          transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className={`flex items-center border-b-2 border-gray-200 dark:border-gray-700 transition-all duration-300 flex-shrink-0 h-[73px] ${isOpen ? 'justify-between px-6' : 'justify-center px-4'}`}>
          <div className={`flex items-center transition-all duration-300 ${isOpen ? 'gap-3 flex-row' : 'gap-0 flex-col'}`}>
            <div className="bg-white dark:bg-white rounded-lg p-2 shadow-sm border-2 border-blue-100 dark:border-gray-100 flex-shrink-0 hover:border-blue-200 dark:hover:border-blue-100 transition-colors">
              <img 
                src={logoPaositra}
                alt="Paositra Malagasy" 
                className={`object-contain ${isOpen ? 'w-6 h-6' : 'w-5 h-5'}`}
              />
            </div>
            {isOpen && (
              <span className="text-xl font-bold text-gray-800 dark:text-white whitespace-nowrap">
                Paositra
              </span>
            )}
          </div>
          {isOpen && (
            <button
              onClick={close}
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex-shrink-0"
              aria-label="Fermer le menu"
              type="button"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Badge pour le directeur */}
        {isDirecteur && isOpen && (
          <div className="px-6 py-3 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-100 dark:border-purple-800">
            <div className="flex items-center gap-2 text-xs text-purple-700 dark:text-purple-300 font-medium">
              <Eye size={14} />
              <span>Consultation uniquement</span>
            </div>
          </div>
        )}

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-8">
          <ul className="space-y-5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`
                      w-full flex items-center rounded-lg
                      transition-all duration-200 font-medium
                      ${isOpen ? 'gap-3 px-4 py-3' : 'justify-center px-2 py-3'}
                      ${isActive 
                        ? isDirecteur 
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                    aria-current={isActive ? 'page' : undefined}
                    title={!isOpen ? item.label : undefined}
                    type="button"
                  >
                    <Icon className="w-6 h-6 flex-shrink-0" />
                    {isOpen && <span className="whitespace-nowrap">{item.label}</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bouton Déconnexion */}
        <div className="p-0 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 mt-auto">
          <button
            onClick={() => setShowConfirmLogout(true)}
            className={`
              w-full flex items-center rounded-lg 
              text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 
              transition-all duration-200 font-medium
              ${isOpen ? 'gap-3 px-6 py-4' : 'justify-center px-4 py-4'}
            `}
            title={!isOpen ? 'Déconnexion' : undefined}
            type="button"
          >
            <LogOut className="w-6 h-6 flex-shrink-0" />
            {isOpen && <span className="whitespace-nowrap">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* ConfirmDialog pour la déconnexion */}
      <ConfirmDialog
        isOpen={showConfirmLogout}
        onClose={() => setShowConfirmLogout(false)}
        onConfirm={() => { setShowConfirmLogout(false); handleLogout(); }}
        title="Déconnexion"
        message="Êtes-vous sûr de vouloir vous déconnecter ?"
        confirmText="Se déconnecter"
        confirmType="primary"
        icon={<LogOut className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
      />
    </>
  )
}
