import { useEffect } from 'react'
import { X } from 'lucide-react'

/**
 * COMPOSANT MODAL RÉUTILISABLE
 * 
 * Props:
 * - isOpen: boolean - Contrôle l'affichage du modal
 * - onClose: function - Fonction appelée à la fermeture
 * - title: string - Titre du modal
 * - children: ReactNode - Contenu du modal (généralement un formulaire)
 * - loading: boolean - État de chargement
 */

export default function Modal({ isOpen, onClose, title, children, loading = false }) {
  // Fermer avec la touche Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Bloquer le scroll du body quand le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    // Overlay : fond semi-transparent
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Modal : la fenêtre */}
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            disabled={loading}
            type="button"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenu avec scroll si nécessaire */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  )
}