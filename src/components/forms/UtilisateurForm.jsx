import { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'

/**
 * FORMULAIRE UTILISATEUR
 * 
 * Props:
 * - initialData: object - Données pour pré-remplir (mode édition)
 * - onSubmit: function - Fonction appelée avec les données du formulaire
 * - loading: boolean - État de chargement
 * - errors: object - Erreurs de validation
 * - mode: string - 'create' ou 'edit'
 * - onCancel: function - Fonction d'annulation
 */

export default function UtilisateurForm({ initialData, onSubmit, loading, errors, mode, onCancel }) {
  const [formData, setFormData] = useState({
    matricule: initialData?.matricule || '',
    nom_utilisateur: initialData?.nom_utilisateur || '',
    email: initialData?.email || '',
    fonction: initialData?.fonction || 'responsable',
    mot_de_passe: '',
    confirmer_mot_de_passe: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Mettre à jour le formulaire quand initialData change
  useEffect(() => {
    if (initialData) {
      setFormData({
        matricule: initialData.matricule || '',
        nom_utilisateur: initialData.nom_utilisateur || '',
        email: initialData.email || '',
        fonction: initialData.fonction || 'responsable',
        mot_de_passe: '',
        confirmer_mot_de_passe: ''
      })
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitForm = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmitForm} className="space-y-4">
      {/* Matricule */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Matricule * (6 chiffres)
        </label>
        <input
          type="text"
          name="matricule"
          value={formData.matricule}
          onChange={handleChange}
          disabled={loading || mode === 'edit'} // Non modifiable en édition
          maxLength={6}
          pattern="\d{6}"
          className={`w-full px-4 py-2 rounded-lg border ${
            errors?.matricule ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } ${mode === 'edit' ? 'bg-gray-100 dark:bg-gray-900 cursor-not-allowed' : 'bg-white dark:bg-gray-700'} text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
          placeholder="Ex: 123456"
          required={mode === 'create'}
        />
        {errors?.matricule && (
          <p className="text-red-500 text-sm mt-1">{errors.matricule}</p>
        )}
        {mode === 'edit' && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Le matricule ne peut pas être modifié
          </p>
        )}
      </div>

      {/* Nom utilisateur */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Nom complet *
        </label>
        <input
          type="text"
          name="nom_utilisateur"
          value={formData.nom_utilisateur}
          onChange={handleChange}
          disabled={loading}
          maxLength={100}
          className={`w-full px-4 py-2 rounded-lg border ${
            errors?.nom_utilisateur ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
          placeholder="Ex: RAKOTO Jean"
          required
        />
        {errors?.nom_utilisateur && (
          <p className="text-red-500 text-sm mt-1">{errors.nom_utilisateur}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          maxLength={100}
          className={`w-full px-4 py-2 rounded-lg border ${
            errors?.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
          placeholder="exemple@paositra.mg"
          required
        />
        {errors?.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Fonction */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Fonction *
        </label>
        <select
          name="fonction"
          value={formData.fonction}
          onChange={handleChange}
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          required
        >
          <option value="responsable">Responsable</option>
          <option value="directeur">Directeur</option>
        </select>
        {errors?.fonction && (
          <p className="text-red-500 text-sm mt-1">{errors.fonction}</p>
        )}
      </div>

      {/* Mot de passe (requis en création, optionnel en modification) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Mot de passe {mode === 'create' && '*'}
          {mode === 'edit' && ' (laisser vide pour ne pas modifier)'}
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="mot_de_passe"
            value={formData.mot_de_passe}
            onChange={handleChange}
            disabled={loading}
            className={`w-full px-4 py-2 pr-10 rounded-lg border ${
              errors?.mot_de_passe ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
            placeholder="Minimum 6 caractères"
            required={mode === 'create'}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors?.mot_de_passe && (
          <p className="text-red-500 text-sm mt-1">{errors.mot_de_passe}</p>
        )}
      </div>

      {/* Confirmer mot de passe */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Confirmer le mot de passe {mode === 'create' && '*'}
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmer_mot_de_passe"
            value={formData.confirmer_mot_de_passe}
            onChange={handleChange}
            disabled={loading}
            className={`w-full px-4 py-2 pr-10 rounded-lg border ${
              errors?.confirmer_mot_de_passe ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
            placeholder="Confirmer le mot de passe"
            required={mode === 'create'}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors?.confirmer_mot_de_passe && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmer_mot_de_passe}</p>
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
          disabled={loading}
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