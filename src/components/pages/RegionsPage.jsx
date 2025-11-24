import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, X, AlertTriangle, MapPin, Eye } from 'lucide-react'
import { 
  getRegions, 
  createRegion, 
  updateRegion, 
  deleteRegion 
} from '../../services/api'


// Modal, ConfirmDialog, RegionForm : inchangés


function Modal({ isOpen, onClose, title, children, loading = false }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md transform animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" disabled={loading} type="button">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, loading = false }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 transform animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading} type="button" className="flex-1 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50">
            Annuler
          </button>
          <button onClick={onConfirm} disabled={loading} type="button" className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Suppression...</>) : ('Supprimer')}
          </button>
        </div>
      </div>
    </div>
  )
}

function RegionForm({ initialData, onSubmit, loading, errors, mode, onCancel }) {
  const [formData, setFormData] = useState({ nom_region: initialData?.nom_region || '' })
  useEffect(() => {
    if (initialData) { setFormData({ nom_region: initialData.nom_region || '' }) }
  }, [initialData])
  const handleChange = e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const handleSubmitForm = e => { e.preventDefault(); onSubmit(formData) }
  return (
    <form onSubmit={handleSubmitForm} className="space-y-4">
      {mode === 'edit' && initialData && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID Région</label>
          <input type="text" value={initialData.id_region} disabled className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-not-allowed"/>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Généré automatiquement</p>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom de la région *</label>
        <input type="text" name="nom_region" value={formData.nom_region} onChange={handleChange}
          disabled={loading}
          className={`w-full px-4 py-2 rounded-lg border ${errors?.nom_region ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors`}
          placeholder="Ex: Analamanga" maxLength={100} required
        />
        {errors?.nom_region && <p className="text-red-500 text-sm mt-1">{errors.nom_region}</p>}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">* Champs obligatoires</p>
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button type="button" onClick={onCancel} disabled={loading}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50">
          Annuler
        </button>
        <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2">
          {loading ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Chargement...</>) : (mode === 'create' ? 'Créer' : 'Modifier')}
        </button>
      </div>
    </form>
  )
}

export default function RegionsPage() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const isDirecteur = user.fonction === 'directeur'
  const isResponsable = user.fonction === 'responsable'

  const [regions, setRegions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [mode, setMode] = useState('create')
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [submitLoading, setSubmitLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => { loadRegions() }, [])

  const loadRegions = async () => {
    setLoading(true)
    try { setRegions(await getRegions()) }
    catch (error) { alert('Erreur lors du chargement des régions') }
    finally { setLoading(false) }
  }

  const filteredRegions = regions.filter(region =>
    region.nom_region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    region.id_region?.toString().includes(searchTerm)
  )

  const handleAdd = () => { setMode('create'); setSelectedRegion(null); setFormErrors({}); setIsModalOpen(true) }
  const handleEdit = (region) => { setMode('edit'); setSelectedRegion(region); setFormErrors({}); setIsModalOpen(true) }
  const handleDelete = (region) => { setSelectedRegion(region); setIsDeleteDialogOpen(true) }

  const validateForm = (formData) => {
    const errors = {}
    if (!formData.nom_region?.trim()) errors.nom_region = 'Le nom de la région est requis'
    else if (formData.nom_region.length > 100) errors.nom_region = 'Le nom ne peut pas dépasser 100 caractères'
    return errors
  }

  const showSuccess = (message) => { setSuccessMessage(message); setTimeout(() => setSuccessMessage(''), 3000) }

  const handleSubmit = async (formData) => {
    const errors = validateForm(formData)
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return }
    setSubmitLoading(true)
    try {
      if (mode === 'create') {
        await createRegion(formData)
        setIsModalOpen(false); setSelectedRegion(null); setFormErrors({}); await loadRegions(); showSuccess('Région créée avec succès!')
      } else {
        await updateRegion(selectedRegion.id_region, formData)
        setIsModalOpen(false); setSelectedRegion(null); setFormErrors({}); await loadRegions(); showSuccess('Région modifiée avec succès!')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue'
      alert(errorMessage)
      if (errorMessage.includes('existe déjà')) setFormErrors({ nom_region: errorMessage })
    } finally { setSubmitLoading(false) }
  }

  const handleConfirmDelete = async () => {
    setSubmitLoading(true)
    try {
      await deleteRegion(selectedRegion.id_region)
      setIsDeleteDialogOpen(false); setSelectedRegion(null); await loadRegions(); showSuccess('Région supprimée avec succès!')
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression'
      alert(errorMessage)
    } finally { setSubmitLoading(false) }
  }

  return (
    <div className="space-y-6">
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

      <div className="flex items-center justify-between animate-slide-in-down">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              {isDirecteur ? 'Liste des Régions' : 'Gestion des Régions'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {filteredRegions.length} région{filteredRegions.length > 1 ? 's' : ''} enregistrée{filteredRegions.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        {!isDirecteur && (
          <button onClick={handleAdd} type="button"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
            <Plus className="w-5 h-5" />
            Ajouter une région
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 animate-slide-in-up">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par ID ou nom de région..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700
              text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-colors" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-slide-in-up">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : filteredRegions.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchTerm ? 'Aucune région trouvée' : 'Aucune région enregistrée'}
            </p>
            {!searchTerm && !isDirecteur && (
              <button
                onClick={handleAdd}
                type="button"
                className="mt-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >Ajouter votre première région
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="relative" style={{maxHeight: "501px"}}>
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Nom de la région
                    </th>
                    {!isDirecteur && (
                      <th className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto">
                  {filteredRegions.map((region, index) => (
                    <tr 
                      key={region.id_region}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                          {region.id_region}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-medium">
                        {region.nom_region}
                      </td>
                      {!isDirecteur && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleEdit(region)} type="button"
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Modifier">
                              <Edit className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleDelete(region)} type="button"
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Supprimer">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals CRUD uniquement pour le responsable */}
      {!isDirecteur && (
        <>
          <Modal
            isOpen={isModalOpen}
            onClose={() => { setIsModalOpen(false); setFormErrors({}); setSelectedRegion(null) }}
            title={mode === 'create' ? 'Ajouter une région' : 'Modifier la région'}
            loading={submitLoading}>
            <RegionForm
              initialData={selectedRegion}
              onSubmit={handleSubmit}
              loading={submitLoading}
              errors={formErrors}
              mode={mode}
              onCancel={() => { setIsModalOpen(false); setFormErrors({}); setSelectedRegion(null) }}
            />
          </Modal>

          <ConfirmDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => { setIsDeleteDialogOpen(false); setSelectedRegion(null) }}
            onConfirm={handleConfirmDelete}
            title="Supprimer la région"
            message={`Êtes-vous sûr de vouloir supprimer la région "${selectedRegion?.nom_region}" (ID: ${selectedRegion?.id_region}) ? Cette action est irréversible.`}
            loading={submitLoading}
          />
        </>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-slide-in-down { animation: slideInDown 0.4s ease-out; }
        .animate-slide-in-up { animation: slideInUp 0.4s ease-out; }
        .animate-slide-in-right { animation: slideInRight 0.3s ease-out; }
        .animate-scale-in { animation: scaleIn 0.2s ease-out; }
      `}</style>
    </div>
  )
}
