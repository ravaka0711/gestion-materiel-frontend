import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Building2, MapPin, Filter, Eye } from 'lucide-react'
import {
  getAgences,
  createAgence,
  updateAgence,
  deleteAgence,
  getRegions
} from '../../services/api'
import Modal from '../common/Modal'
import ConfirmDialog from '../common/ConfirmDialog'
import AgenceForm from '../forms/AgenceForm'

export default function AgencesPage() {
  // Ajout détection du rôle utilisateur
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isDirecteur = user.fonction === 'directeur'
  const isResponsable = user.fonction === 'responsable'

  const [agences, setAgences] = useState([])
  const [regions, setRegions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRegion, setFilterRegion] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [mode, setMode] = useState('create')
  const [selectedAgence, setSelectedAgence] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [submitLoading, setSubmitLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [agencesData, regionsData] = await Promise.all([
        getAgences(),
        getRegions()
      ])
      setAgences(agencesData)
      setRegions(regionsData)
    } catch (error) {
      alert('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const safeToLower = v => typeof v === 'string' ? v.toLowerCase() : String(v || '').toLowerCase();

  const filteredAgences = agences.filter(agence => {
    const matchesSearch =
      safeToLower(agence.code_agence).includes(searchTerm.toLowerCase()) ||
      safeToLower(agence.nom_agence).includes(searchTerm.toLowerCase()) ||
      safeToLower(agence.adresse).includes(searchTerm.toLowerCase())
    const matchesRegion =
      filterRegion === 'all' ||
      agence.id_region === parseInt(filterRegion) ||
      agence.Region?.id_region === parseInt(filterRegion)
    return matchesSearch && matchesRegion
  })

  const handleAdd = () => {
    setMode('create')
    setSelectedAgence(null)
    setFormErrors({})
    setIsModalOpen(true)
  }

  const handleEdit = (agence) => {
    setMode('edit')
    setSelectedAgence(agence)
    setFormErrors({})
    setIsModalOpen(true)
  }

  const handleDelete = (agence) => {
    setSelectedAgence(agence)
    setIsDeleteDialogOpen(true)
  }

  const validateForm = (formData) => {
    const errors = {}
    if (mode === 'create') {
      if (!formData.code_agence?.trim()) {
        errors.code_agence = 'Le code agence est requis'
      } else if (formData.code_agence.length > 10) {
        errors.code_agence = 'Le code ne peut pas dépasser 10 caractères'
      }
    }
    if (!formData.nom_agence?.trim()) {
      errors.nom_agence = 'Le nom de l\'agence est requis'
    } else if (formData.nom_agence.length > 100) {
      errors.nom_agence = 'Le nom ne peut pas dépasser 100 caractères'
    }
    if (!formData.adresse?.trim()) {
      errors.adresse = 'L\'adresse est requise'
    } else if (formData.adresse.length > 255) {
      errors.adresse = 'L\'adresse ne peut pas dépasser 255 caractères'
    }
    if (!formData.id_region) {
      errors.id_region = 'La région est requise'
    } else {
      const regionExists = regions.some(r => r.id_region === parseInt(formData.id_region))
      if (!regionExists) {
        errors.id_region = 'Région invalide'
      }
    }
    return errors
  }

  const showSuccess = (message) => {
    setSuccessMessage(message)
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const handleSubmit = async (formData) => {
    const errors = validateForm(formData)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    setSubmitLoading(true)
    try {
      const dataToSend = {
        nom_agence: formData.nom_agence,
        adresse: formData.adresse,
        id_region: parseInt(formData.id_region)
      }
      if (mode === 'create') {
        dataToSend.code_agence = formData.code_agence.toUpperCase()
        await createAgence(dataToSend)
        showSuccess('Agence créée avec succès!')
      } else {
        await updateAgence(selectedAgence.code_agence, dataToSend)
        showSuccess('Agence modifiée avec succès!')
      }
      setIsModalOpen(false)
      setSelectedAgence(null)
      setFormErrors({})
      await loadData()
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue'
      alert(errorMessage)
      if (errorMessage.includes('code') || errorMessage.includes('existe déjà')) {
        setFormErrors({ code_agence: errorMessage })
      }
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    setSubmitLoading(true)
    try {
      await deleteAgence(selectedAgence.code_agence)
      showSuccess('Agence supprimée avec succès!')
      setIsDeleteDialogOpen(false)
      setSelectedAgence(null)
      await loadData()
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression'
      alert(errorMessage)
    } finally {
      setSubmitLoading(false)
    }
  }

  const RegionBadge = ({ region }) => {
    if (!region) {
      return (
        <span className="px-3 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-full text-xs">
          Non définie
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium">
        <MapPin className="w-3 h-3" />
        {region.nom_region}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Badge consultation uniquement pour le directeur */}
      {isDirecteur}

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

      {/* En-tête */}
      <div className="animate-slide-in-down">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                {isDirecteur ? "Liste des Agences" : "Gestion des Agences"}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {filteredAgences.length} agence{filteredAgences.length > 1 ? 's' : ''} affichée{filteredAgences.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          {/* Bouton ajouter pour responsable uniquement */}
          {!isDirecteur && (
            <button
              onClick={handleAdd}
              type="button"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Ajouter une agence
            </button>
          )}
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
              placeholder="Rechercher par code, nom ou adresse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
          {/* Filtre par région */}
          <div className="md:w-64 relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes les régions</option>
              {regions.map(region => (
                <option key={region.id_region} value={region.id_region}>
                  {region.nom_region}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table des agences */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-slide-in-up">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : filteredAgences.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchTerm || filterRegion !== 'all' ? 'Aucune agence trouvée' : 'Aucune agence enregistrée'}
            </p>
            {!isDirecteur && !searchTerm && filterRegion === 'all' && (
              <button
                onClick={handleAdd}
                type="button"
                className="mt-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Ajouter votre première agence
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="relative" style={{ maxHeight: "calc(100vh - 360px)" }}>
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Adresse
                    </th>
                    <th className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Région
                    </th>
                    {/* Actions uniquement pour responsable */}
                    {!isDirecteur && (
                      <th className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto">
                  {filteredAgences.map((agence, index) => (
                    <tr
                      key={agence.code_agence}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-mono font-medium">
                          {agence.code_agence}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{agence.nom_agence}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate" title={agence.adresse}>{agence.adresse}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <RegionBadge region={agence.Region} />
                      </td>
                      {/* Boutons seulement pour responsable */}
                      {!isDirecteur && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(agence)}
                              type="button"
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(agence)}
                              type="button"
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                  {/* Ligne invisible pour ajouter de l'espace en bas */}
                  <tr>
                    <td colSpan={!isDirecteur ? "5" : "4"} className="bg-transparent"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals CRUD affichés seulement si responsable */}
      {!isDirecteur && (
        <>
          <Modal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false)
              setFormErrors({})
              setSelectedAgence(null)
            }}
            title={mode === 'create' ? 'Ajouter une agence' : 'Modifier l\'agence'}
            loading={submitLoading}
          >
            <AgenceForm
              initialData={selectedAgence}
              onSubmit={handleSubmit}
              loading={submitLoading}
              errors={formErrors}
              mode={mode}
              onCancel={() => {
                setIsModalOpen(false)
                setFormErrors({})
                setSelectedAgence(null)
              }}
            />
          </Modal>
          <ConfirmDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => {
              setIsDeleteDialogOpen(false)
              setSelectedAgence(null)
            }}
            onConfirm={handleConfirmDelete}
            title="Supprimer l'agence"
            message={`Êtes-vous sûr de vouloir supprimer l'agence "${selectedAgence?.nom_agence}" (${selectedAgence?.code_agence}) ? Cette action est irréversible et impossible si l'agence est associée à des matériels, maintenances ou logiciels.`}
            loading={submitLoading}
          />
        </>
      )}

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
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slide-in-down { animation: slideInDown 0.4s ease-out; }
        .animate-slide-in-up { animation: slideInUp 0.4s ease-out; }
        .animate-slide-in-right { animation: slideInRight 0.3s ease-out; }
        .animate-scale-in { animation: scaleIn 0.2s ease-out; }
      `}</style>
    </div>
  )
}
