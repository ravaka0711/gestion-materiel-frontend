import { useState, useEffect } from 'react';
import Modal from '../common/Modal';

const LogicielForm = ({ logiciel, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    id_logiciel: '',
    nom_logiciel: '',
    version: '',
    date_installation: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (logiciel) {
      setFormData({
        id_logiciel: logiciel.id_logiciel || '',
        nom_logiciel: logiciel.nom_logiciel || '',
        version: logiciel.version || '',
        date_installation: logiciel.date_installation || '',
      });
    }
  }, [logiciel]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.id_logiciel) {
      newErrors.id_logiciel = "L'ID est requis";
    } else if (isNaN(formData.id_logiciel)) {
      newErrors.id_logiciel = "L'ID doit être un nombre";
    }
    
    if (!formData.nom_logiciel.trim()) {
      newErrors.nom_logiciel = 'Le nom du logiciel est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const isEditing = !!logiciel;

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={isEditing ? 'Modifier le logiciel' : 'Ajouter un logiciel'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Logiciel <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="id_logiciel"
            value={formData.id_logiciel}
            onChange={handleChange}
            disabled={isEditing}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.id_logiciel ? 'border-red-500' : 'border-gray-300'
            } ${isEditing ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            placeholder="Ex: 1"
          />
          {errors.id_logiciel && (
            <p className="mt-1 text-sm text-red-500">{errors.id_logiciel}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du logiciel <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="nom_logiciel"
            value={formData.nom_logiciel}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.nom_logiciel ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: Microsoft Office"
          />
          {errors.nom_logiciel && (
            <p className="mt-1 text-sm text-red-500">{errors.nom_logiciel}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Version
          </label>
          <input
            type="text"
            name="version"
            value={formData.version}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: 2021"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date d'installation
          </label>
          <input
            type="date"
            name="date_installation"
            value={formData.date_installation}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isEditing ? 'Mettre à jour' : 'Créer'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default LogicielForm;