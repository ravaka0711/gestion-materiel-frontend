import { useState, useEffect } from 'react'
import { useSidebar } from '../../contexts/SidebarContext'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout({ pageTitle = 'Dashboard', children }) {
  const { isOpen } = useSidebar()
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)

  // Détecter les changements de taille d'écran
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Calculer la marge gauche
  const marginLeft = isDesktop ? (isOpen ? '256px' : '80px') : '0'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenu principal qui s'adapte à la largeur du sidebar */}
      <div 
        className="transition-all duration-300 ease-in-out"
        style={{ marginLeft }}
      >
        {/* Header avec titre dynamique */}
        <Header pageTitle={pageTitle} />
        
        {/* Zone de contenu des pages */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}