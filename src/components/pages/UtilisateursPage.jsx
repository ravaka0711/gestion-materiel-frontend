import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Users, Shield, UserCog } from 'lucide-react'
import { 
  getUtilisateurs, 
  createUtilisateur, 
  updateUtilisateur, 
  deleteUtilisateur 
} from '../../services/api'
import Modal from '../common/Modal'
import ConfirmDialog from '../common/ConfirmDialog'
import UtilisateurForm from '../forms/UtilisateurForm'

/**
 * PAGE PRINCIPALE - GESTION DES UTILISATEURS
 * 
 * Fonctionnalités :
 * - Liste de tous les utilisateurs
 * - Recherche par matricule, nom ou email
 * - Création d'un nouvel utilisateur
 * - Modification d'un utilisateur existant
 * - Suppression d'un utilisateur
 * - Filtrage par fonction (directeur/responsable)
 */

export default function UtilisateursPage() {
  // ==================== ÉTATS ====================
  const [utilisateurs, setUtilisateurs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterFonction, setFilterFonction] = useState('all') // 'all', 'directeur', 'responsable'
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [mode, setMode] = useState('create') // 'create' ou 'edit'
  const [selectedUtilisateur, setSelectedUtilisateur] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [submitLoading, setSubmitLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // ==================== CHARGEMENT DES DONNÉES ====================
  
  /**
   * Charger tous les utilisateurs au montage du composant
   */
  useEffect(() => {
    loadUtilisateurs()
  }, [])

  /**
   * Fonction pour charger les utilisateurs depuis l'API
   */
  const loadUtilisateurs = async () => {
    setLoading(true)
    try {
      const data = await getUtilisateurs()
      console.log('📥 Utilisateurs chargés:', data)
      setUtilisateurs(data)
    } catch (error) {
      console.error('❌ Erreur chargement utilisateurs:', error)
      alert('Erreur lors du chargement des utilisateurs')
    } finally {
      setLoading(false)
    }
  }

  // ==================== FILTRAGE ET RECHERCHE ====================
  
  /**
   * Filtrer les utilisateurs selon :
   * - Le terme de recherche (matricule, nom, email)
   * - Le filtre de fonction (directeur/responsable)
   */
  const filteredUtilisateurs = utilisateurs.filter(user => {
    // Filtre par recherche
    const matchesSearch = 
      user.matricule?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nom_utilisateur?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Filtre par fonction
    const matchesFonction = 
      filterFonction === 'all' || user.fonction === filterFonction
    
    return matchesSearch && matchesFonction
  })

  // Statistiques
  const stats = {
    total: utilisateurs.length,
    directeurs: utilisateurs.filter(u => u.fonction === 'directeur').length,
    responsables: utilisateurs.filter(u => u.fonction === 'responsable').length
  }

  // ==================== ACTIONS MODALES ====================
  
  /**
   * Ouvrir le modal en mode création
   */
  const handleAdd = () => {
    setMode('create')
    setSelectedUtilisateur(null)
    setFormErrors({})
    setIsModalOpen(true)
  }

  /**
   * Ouvrir le modal en mode édition
   */
  const handleEdit = (utilisateur) => {
    setMode('edit')
    setSelectedUtilisateur(utilisateur)
    setFormErrors({})
    setIsModalOpen(true)
  }

  /**
   * Ouvrir le dialog de confirmation de suppression
   */
  const handleDelete = (utilisateur) => {
    setSelectedUtilisateur(utilisateur)
    setIsDeleteDialogOpen(true)
  }

  // ==================== VALIDATION ====================
  
  /**
   * Valider les données du formulaire
   * Retourne un objet avec les erreurs ou un objet vide si valide
   */
  const validateForm = (formData) => {
    const errors = {}
    
    // Matricule (6 chiffres)
    if (!formData.matricule?.trim()) {
      errors.matricule = 'Le matricule est requis'
    } else if (!/^\d{6}$/.test(formData.matricule)) {
      errors.matricule = 'Le matricule doit contenir exactement 6 chiffres'
    }
    
    // Nom utilisateur
    if (!formData.nom_utilisateur?.trim()) {
      errors.nom_utilisateur = 'Le nom est requis'
    } else if (formData.nom_utilisateur.length > 100) {
      errors.nom_utilisateur = 'Le nom ne peut pas dépasser 100 caractères'
    }
    
    // Email
    if (!formData.email?.trim()) {
      errors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email invalide'
    } else if (formData.email.length > 100) {
      errors.email = 'L\'email ne peut pas dépasser 100 caractères'
    }
    
    // Fonction
    if (!['directeur', 'responsable'].includes(formData.fonction)) {
      errors.fonction = 'Fonction invalide'
    }
    
    // Mot de passe (requis en création uniquement)
    if (mode === 'create') {
      if (!formData.mot_de_passe) {
        errors.mot_de_passe = 'Le mot de passe est requis'
      } else if (formData.mot_de_passe.length < 6) {
        errors.mot_de_passe = 'Le mot de passe doit contenir au moins 6 caractères'
      }
      
      if (!formData.confirmer_mot_de_passe) {
        errors.confirmer_mot_de_passe = 'Veuillez confirmer le mot de passe'
      } else if (formData.mot_de_passe !== formData.confirmer_mot_de_passe) {
        errors.confirmer_mot_de_passe = 'Les mots de passe ne correspondent pas'
      }
    } else if (mode === 'edit') {
      // En modification, si un mot de passe est saisi, il doit être valide
      if (formData.mot_de_passe) {
        if (formData.mot_de_passe.length < 6) {
          errors.mot_de_passe = 'Le mot de passe doit contenir au moins 6 caractères'
        }
        if (formData.mot_de_passe !== formData.confirmer_mot_de_passe) {
          errors.confirmer_mot_de_passe = 'Les mots de passe ne correspondent pas'
        }
      }
    }
    
    return errors
  }

  // ==================== MESSAGE DE SUCCÈS ====================
  
  /**
   * Afficher un message de succès temporaire (3 secondes)
   */
  const showSuccess = (message) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  // ==================== SOUMISSION DU FORMULAIRE ====================
  
  /**
   * Gérer la soumission du formulaire (création ou modification)
   */
  const handleSubmit = async (formData) => {
    // Valider les données
    const errors = validateForm(formData)
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setSubmitLoading(true)
    
    try {
      // Préparer les données à envoyer
      const dataToSend = {
        matricule: formData.matricule,
        nom_utilisateur: formData.nom_utilisateur,
        email: formData.email,
        fonction: formData.fonction,
      }

      // Ajouter le mot de passe seulement s'il est fourni
      if (formData.mot_de_passe) {
        dataToSend.mot_de_passe = formData.mot_de_passe
      }

      if (mode === 'create') {
        console.log('📝 Création utilisateur:', dataToSend)
        const response = await createUtilisateur(dataToSend)
        console.log('📬 Réponse création:', response)
        
        showSuccess('Utilisateur créé avec succès!')
        
      } else {
        console.log('✏️ Modification utilisateur:', selectedUtilisateur.matricule, dataToSend)
        const response = await updateUtilisateur(selectedUtilisateur.matricule, dataToSend)
        console.log('📬 Réponse modification:', response)
        
        showSuccess('Utilisateur modifié avec succès!')
      }
      
      // Fermer le modal
      setIsModalOpen(false)
      setSelectedUtilisateur(null)
      setFormErrors({})
      
      // Recharger la liste
      await loadUtilisateurs()
      
    } catch (error) {
      console.error('❌ Erreur soumission:', error)
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue'
      alert(errorMessage)
      
      // Si l'erreur concerne un email déjà utilisé
      if (errorMessage.includes('email') || errorMessage.includes('déjà utilisé')) {
        setFormErrors({ email: errorMessage })
      }
    } finally {
      setSubmitLoading(false)
    }
  }

  // ==================== SUPPRESSION ====================
  
  /**
   * Confirmer et exécuter la suppression d'un utilisateur
   */
  const handleConfirmDelete = async () => {
    setSubmitLoading(true)
    
    try {
      console.log('🗑️ Suppression utilisateur:', selectedUtilisateur.matricule)
      await deleteUtilisateur(selectedUtilisateur.matricule)
      
      showSuccess('Utilisateur supprimé avec succès!')
      
      // Fermer le dialog
      setIsDeleteDialogOpen(false)
      setSelectedUtilisateur(null)
      
      // Recharger la liste
      await loadUtilisateurs()
      
    } catch (error) {
      console.error('❌ Erreur suppression:', error)
      const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression'
      alert(errorMessage)
    } finally {
      setSubmitLoading(false)
    }
  }

  // ==================== BADGE FONCTION ====================
  
  /**
   * Composant pour afficher un badge de fonction avec icône et couleur
   */
  const FonctionBadge = ({ fonction }) => {
    const config = {
      directeur: {
        icon: Shield,
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
        label: 'Directeur'
      },
      responsable: {
        icon: UserCog,
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        label: 'Responsable'
      }
    }

    const { icon: Icon, color, label } = config[fonction] || config.responsable

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${color}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    )
  }

  // ==================== RENDU JSX ====================
  
  return (
    <div className="space-y-6">
      {/* Message de succès flottant */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        </div>
      )}

      {/* En-tête avec statistiques */}
      <div className="animate-slide-in-down">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                Gestion des Utilisateurs
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {filteredUtilisateurs.length} utilisateur{filteredUtilisateurs.length > 1 ? 's' : ''} affiché{filteredUtilisateurs.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={handleAdd}
            type="button"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Ajouter un utilisateur
          </button>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
              </div>
              <Users className="w-10 h-10 text-blue-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Directeurs</p>
                <p className="text-2xl font-bold text-purple-600">{stats.directeurs}</p>
              </div>
              <Shield className="w-10 h-10 text-purple-500 opacity-50" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Responsables</p>
                <p className="text-2xl font-bold text-blue-600">{stats.responsables}</p>
              </div>
              <UserCog className="w-10 h-10 text-blue-500 opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 animate-slide-in-up">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par matricule, nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Filtre par fonction */}
          <div className="md:w-48">
            <select
              value={filterFonction}
              onChange={(e) => setFilterFonction(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes les fonctions</option>
              <option value="directeur">Directeurs</option>
              <option value="responsable">Responsables</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table des utilisateurs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-slide-in-up">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : filteredUtilisateurs.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchTerm || filterFonction !== 'all' ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur enregistré'}
            </p>
            {!searchTerm && filterFonction === 'all' && (
              <button
                onClick={handleAdd}
                type="button"
                className="mt-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Ajouter votre premier utilisateur
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Matricule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Fonction
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUtilisateurs.map((utilisateur, index) => (
                  <tr 
                    key={utilisateur.matricule}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-full text-sm font-mono font-medium">
                        {utilisateur.matricule}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {utilisateur.nom_utilisateur}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {utilisateur.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <FonctionBadge fonction={utilisateur.fonction} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(utilisateur)}
                          type="button"
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(utilisateur)}
                          type="button"
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Ajout/Modification */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setFormErrors({})
          setSelectedUtilisateur(null)
        }}
        title={mode === 'create' ? 'Ajouter un utilisateur' : 'Modifier l\'utilisateur'}
        loading={submitLoading}
      >
        <UtilisateurForm
          initialData={selectedUtilisateur}
          onSubmit={handleSubmit}
          loading={submitLoading}
          errors={formErrors}
          mode={mode}
          onCancel={() => {
            setIsModalOpen(false)
            setFormErrors({})
            setSelectedUtilisateur(null)
          }}
        />
      </Modal>

      {/* Dialog de confirmation de suppression */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setSelectedUtilisateur(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Supprimer l'utilisateur"
        message={`Êtes-vous sûr de vouloir supprimer l'utilisateur "${selectedUtilisateur?.nom_utilisateur}" (${selectedUtilisateur?.matricule}) ? Cette action est irréversible.`}
        loading={submitLoading}
      />

      {/* Styles pour les animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-slide-in-down {
          animation: slideInDown 0.4s ease-out;
        }
        .animate-slide-in-up {
          animation: slideInUp 0.4s ease-out;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}