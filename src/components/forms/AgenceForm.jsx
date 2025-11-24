import { useState, useEffect } from 'react'
import { MapPin } from 'lucide-react'
import { getRegions } from '../../services/api'

/**
 * FORMULAIRE AGENCE
 * 
 * Props :
 * - initialData: object - Données pour pré-remplir (mode édition)
 * - onSubmit: function - Fonction appelée avec les données du formulaire
 * - loading: boolean - État de chargement
 * - errors: object - Erreurs de validation
 * - mode: string - 'create' ou 'edit'
 * - onCancel: function - Fonction d'annulation
 * 
 * Champs du formulaire :
 * - code_agence: string (10 caractères max, non modifiable en édition)
 * - nom_agence: string (100 caractères max)
 * - adresse: string (255 caractères max)
 * - id_region: number (select depuis la liste des régions)
 */

export default function AgenceForm({ initialData, onSubmit, loading, errors, mode, onCancel }) {
  // État du formulaire
  const [formData, setFormData] = useState({
    code_agence: initialData?.code_agence || '',
    nom_agence: initialData?.nom_agence || '',
    adresse: initialData?.adresse || '',
    id_region: initialData?.id_region || initialData?.Region?.id_region || ''
  })

  // Liste des régions pour le select
  const [regions, setRegions] = useState([])
  const [loadingRegions, setLoadingRegions] = useState(true)

  // Charger les régions au montage du composant
  useEffect(() => {
    loadRegions()
  }, [])

  // Mettre à jour le formulaire quand initialData change
  useEffect(() => {
    if (initialData) {
      setFormData({
        code_agence: initialData.code_agence || '',
        nom_agence: initialData.nom_agence || '',
        adresse: initialData.adresse || '',
        id_region: initialData.id_region || initialData.Region?.id_region || ''
      })
    }
  }, [initialData])

  /**
   * Charger la liste des régions depuis l'API
   */
  const loadRegions = async () => {
    setLoadingRegions(true)
    try {
      const data = await getRegions()
      console.log('📥 Régions chargées pour le formulaire:', data)
      setRegions(data)
    } catch (error) {
      console.error('❌ Erreur chargement régions:', error)
      alert('Erreur lors du chargement des régions')
    } finally {
      setLoadingRegions(false)
    }
  }

  /**
   * Gérer les changements dans les champs du formulaire
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  /**
   * Soumettre le formulaire
   */
  const handleSubmitForm = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmitForm} className="space-y-4">
      {/* Code Agence */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Code Agence * (max 10 caractères)
        </label>
        <input
          type="text"
          name="code_agence"
          value={formData.code_agence}
          onChange={handleChange}
          disabled={loading || mode === 'edit'} // Non modifiable en édition
          maxLength={10}
          className={`w-full px-4 py-2 rounded-lg border ${
            errors?.code_agence ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } ${mode === 'edit' ? 'bg-gray-100 dark:bg-gray-900 cursor-not-allowed' : 'bg-white dark:bg-gray-700'} text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50 uppercase`}
          placeholder="Ex: AG001"
          required={mode === 'create'}
        />
        {errors?.code_agence && (
          <p className="text-red-500 text-sm mt-1">{errors.code_agence}</p>
        )}
        {mode === 'edit' && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Le code agence ne peut pas être modifié
          </p>
        )}
      </div>

      {/* Nom Agence */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nom de l'agence * (max 100 caractères)
        </label>
        <input
          type="text"
          name="nom_agence"
          value={formData.nom_agence}
          onChange={handleChange}
          disabled={loading}
          maxLength={100}
          className={`w-full px-4 py-2 rounded-lg border ${
            errors?.nom_agence ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
          placeholder="Ex: Agence Centrale Antananarivo"
          required
        />
        {errors?.nom_agence && (
          <p className="text-red-500 text-sm mt-1">{errors.nom_agence}</p>
        )}
      </div>

      {/* Adresse */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Adresse * (max 255 caractères)
        </label>
        <textarea
          name="adresse"
          value={formData.adresse}
          onChange={handleChange}
          disabled={loading}
          maxLength={255}
          rows={3}
          className={`w-full px-4 py-2 rounded-lg border ${
            errors?.adresse ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none`}
          placeholder="Adresse complète de l'agence"
          required
        />
        {errors?.adresse && (
          <p className="text-red-500 text-sm mt-1">{errors.adresse}</p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {formData.adresse.length} / 255 caractères
        </p>
      </div>

      {/* Région */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Région *
        </label>
        {loadingRegions ? (
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-600 dark:text-gray-400">Chargement des régions...</span>
          </div>
        ) : (
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              name="id_region"
              value={formData.id_region}
              onChange={handleChange}
              disabled={loading || regions.length === 0}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                errors?.id_region ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
              required
            >
              <option value="">-- Sélectionner une région --</option>
              {regions.map(region => (
                <option key={region.id_region} value={region.id_region}>
                  {region.nom_region}
                </option>
              ))}
            </select>
          </div>
        )}
        {errors?.id_region && (
          <p className="text-red-500 text-sm mt-1">{errors.id_region}</p>
        )}
        {regions.length === 0 && !loadingRegions && (
          <p className="text-orange-500 text-sm mt-1">
            Aucune région disponible. Veuillez d'abord créer des régions.
          </p>
        )}
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        * Champs obligatoires
      </p>

      {/* Boutons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading || regions.length === 0}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Chargement...
            </>
          ) : (
            mode === 'create' ? 'Créer' : 'Modifier'
          )}
        </button>
      </div>
    </form>
  )
}