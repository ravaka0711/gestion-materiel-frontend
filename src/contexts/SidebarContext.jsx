import { createContext, useState, useContext } from 'react'

/**
 * EXPLICATION :
 * Ce Context gère l'état du sidebar (ouvert/fermé)
 * Permet à n'importe quel composant de contrôler le sidebar
 */

const SidebarContext = createContext()

export function SidebarProvider({ children }) {
  // État : true = ouvert, false = fermé
  const [isOpen, setIsOpen] = useState(false)

  // Basculer l'état
  const toggle = () => setIsOpen(prev => !prev)
  
  // Fermer explicitement
  const close = () => setIsOpen(false)
  
  // Ouvrir explicitement
  const open = () => setIsOpen(true)

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

// Hook personnalisé pour utiliser le sidebar
export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar doit être utilisé dans un SidebarProvider')
  }
  return context
}