import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getAgences } from '../../services/api';

const MaterielForm = ({ materiel, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    id_materiel: '',
    numero_serie: '',
    nom_materiel: '',
    marque: '',
    modele: '',
    source: '',
    date_acquisition: '',
    etat: 'utilisable',
    caracteristique: '',
    code_agence: '',
  });

  const [agences, setAgences] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAgences();
    if (materiel) {
      setFormData({
        id_materiel: materiel.id_materiel || '',
        numero_serie: materiel.numero_serie || '',
        nom_materiel: materiel.nom_materiel || '',
        marque: materiel.marque || '',
        modele: materiel.modele || '',
        source: materiel.source || '',
        date_acquisition: materiel.date_acquisition || '',
        etat: materiel.etat || 'utilisable',
        caracteristique: materiel.caracteristique || '',
        code_agence: materiel.code_agence || '',
      });
    }
  }, [materiel]);

  const fetchAgences = async () => {
    try {
      const data = await getAgences();
      setAgences(data);
    } catch (error) {
      console.error('Erreur chargement agences:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.id_materiel && !materiel) {
      newErrors.id_materiel = 'L\'ID du matériel est requis';
    }
    if (!formData.numero_serie) {
      newErrors.numero_serie = 'Le numéro de série est requis';
    }
    if (!formData.nom_materiel) {
      newErrors.nom_materiel = 'Le nom du matériel est requis';
    }
    if (!formData.code_agence) {
      newErrors.code_agence = 'L\'agence est requise';
    }
    if (!formData.etat) {
      newErrors.etat = 'L\'état est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {materiel ? 'Modifier le matériel' : 'Ajouter un matériel'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ID Matériel */}
            {!materiel && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Matériel <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="id_materiel"
                  value={formData.id_materiel}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.id_materiel ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Ex: 1"
                />
                {errors.id_materiel && (
                  <p className="mt-1 text-sm text-red-500">{errors.id_materiel}</p>
                )}
              </div>
            )}

            {/* Numéro de série */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de série <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="numero_serie"
                value={formData.numero_serie}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.numero_serie ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Ex: MAT-000001"
              />
              {errors.numero_serie && (
                <p className="mt-1 text-sm text-red-500">{errors.numero_serie}</p>
              )}
            </div>

            {/* Nom matériel */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du matériel <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nom_materiel"
                value={formData.nom_materiel}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.nom_materiel ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Ex: Ordinateur portable"
              />
              {errors.nom_materiel && (
                <p className="mt-1 text-sm text-red-500">{errors.nom_materiel}</p>
              )}
            </div>

            {/* Marque */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marque
              </label>
              <input
                type="text"
                name="marque"
                value={formData.marque}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Dell"
              />
            </div>

            {/* Modèle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modèle
              </label>
              <input
                type="text"
                name="modele"
                value={formData.modele}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Latitude 5520"
              />
            </div>

            {/* Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source
              </label>
              <input
                type="text"
                name="source"
                value={formData.source}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: DIRPM"
              />
            </div>

            {/* Date acquisition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date d'acquisition
              </label>
              <input
                type="date"
                name="date_acquisition"
                value={formData.date_acquisition}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* État */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                État <span className="text-red-500">*</span>
              </label>
              <select
                name="etat"
                value={formData.etat}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.etat ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="utilisable">Utilisable</option>
                <option value="non utilisable">Non utilisable</option>
                <option value="en panne">En panne</option>
              </select>
              {errors.etat && (
                <p className="mt-1 text-sm text-red-500">{errors.etat}</p>
              )}
            </div>

            {/* Agence */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agence <span className="text-red-500">*</span>
              </label>
              <select
                name="code_agence"
                value={formData.code_agence}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.code_agence ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="">Sélectionner une agence</option>
                {agences.map(agence => (
                  <option key={agence.code_agence} value={agence.code_agence}>
                    {agence.nom_agence}
                  </option>
                ))}
              </select>
              {errors.code_agence && (
                <p className="mt-1 text-sm text-red-500">{errors.code_agence}</p>
              )}
            </div>

            {/* Caractéristique */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Caractéristique
              </label>
              <textarea
                name="caracteristique"
                value={formData.caracteristique}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Intel Core i7, 16GB RAM, SSD 512GB"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : materiel ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterielForm;
