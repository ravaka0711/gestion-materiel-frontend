import { AlertTriangle, LogOut } from 'lucide-react'

/**
 * DIALOG DE CONFIRMATION GÉNÉRIQUE
 * 
 * Props :
 * - isOpen: boolean - contrôle l'affichage
 * - onClose: function - ferme le dialog
 * - onConfirm: function - appelé à la confirmation
 * - title: string - le titre de la boîte
 * - message: string|ReactNode - contenu du message
 * - loading: bool (facultatif)
 * - confirmText: string (label du bouton, défaut : "Confirmer")
 * - icon: ReactNode (icône spécifique, facultatif)
 * - confirmType: "danger"|"primary", défaut "danger" (couleur bouton)
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  loading = false,
  confirmText = 'Confirmer',
  icon,
  confirmType = 'danger'
}) {
  if (!isOpen) return null

  const DefaultIcon = confirmType === 'danger'
    ? <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
    : <LogOut className="w-6 h-6 text-blue-600 dark:text-blue-400" />

  const confirmBtnClass =
    confirmType === 'danger'
      ? 'bg-red-600 text-white hover:bg-red-700'
      : 'bg-blue-600 text-white hover:bg-blue-700'

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full mb-4"
          style={confirmType === 'danger'
            ? { background: 'rgba(239,68,68,0.1)' }
            : { background: 'rgba(59,130,246,0.10)' }}
        >
          {icon || DefaultIcon}
        </div>
        <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            type="button"
            className="flex-1 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            type="button"
            className={`flex-1 px-4 py-2 rounded-lg ${confirmBtnClass} flex items-center justify-center gap-2 transition-colors disabled:opacity-50`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {confirmText}...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
