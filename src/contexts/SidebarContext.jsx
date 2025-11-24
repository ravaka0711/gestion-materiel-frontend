import { createContext, useState, useContext, useEffect } from 'react'

const SidebarContext = createContext()

export function SidebarProvider({ children }) {
  // Sur desktop : ouvert par défaut, sur mobile : fermé
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024
    }
    return true
  })

  // Gère le redimensionnement : adapte le comportement selon la taille
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // Sur desktop, on garde l'état actuel (ne force pas l'ouverture)
      } else {
        // Sur mobile, on ferme automatiquement
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggle = () => {
    setIsOpen(prev => {
      console.log('Toggle sidebar - Avant:', prev, 'Après:', !prev)
      return !prev
    })
  }
  
  const close = () => {
    console.log('Fermer sidebar')
    setIsOpen(false)
  }
  
  const open = () => {
    console.log('Ouvrir sidebar')
    setIsOpen(true)
  }

  const value = {
    isOpen,
    toggle,
    close,
    open
  }

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar doit être utilisé dans un SidebarProvider')
  }
  return context
}