import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Building2 } from 'lucide-react';

const ManageAgencesModal = ({ 
  logiciel, 
  onClose, 
  onAgenceAdded, 
  onAgenceRemoved,
  currentAgences = [],
  availableAgences = []
}) => {
  const [selectedAgence, setSelectedAgence] = useState('');
  const [loading, setLoading] = useState(false);

  // Filtrer les agences déjà associées
  const agencesNonAssociees = availableAgences.filter(
    agence => !currentAgences.some(ca => ca.code_agence === agence.code_agence)
  );

  const handleAddAgence = async () => {
    if (!selectedAgence) return;
    setLoading(true);
    try {
      await onAgenceAdded(selectedAgence);
      setSelectedAgence('');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAgence = async (code_agence) => {
    setLoading(true);
    try {
      await onAgenceRemoved(code_agence);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Gérer les agences
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {logiciel.nom_logiciel} {logiciel.version && `v${logiciel.version}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
          {/* Section d'ajout */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Ajouter une agence
            </h3>
            <div className="flex gap-2">
              <select
                value={selectedAgence}
                onChange={(e) => setSelectedAgence(e.target.value)}
                disabled={loading || agencesNonAssociees.length === 0}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  {agencesNonAssociees.length === 0 
                    ? 'Toutes les agences sont déjà associées' 
                    : 'Sélectionner une agence...'}
                </option>
                {agencesNonAssociees.map(agence => (
                  <option key={agence.code_agence} value={agence.code_agence}>
                    {agence.nom_agence} - {agence.Region?.nom_region || 'N/A'}
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddAgence}
                disabled={!selectedAgence || loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={18} />
                Ajouter
              </button>
            </div>
          </div>

          {/* Liste des agences associées */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Agences associées ({currentAgences.length})
            </h3>
            {currentAgences.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Building2 size={48} className="mx-auto mb-2 opacity-50" />
                <p>Aucune agence n'utilise ce logiciel</p>
              </div>
            ) : (
              <div className="space-y-2">
                {currentAgences.map(agence => (
                  <div
                    key={agence.code_agence}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {agence.nom_agence}
                      </p>
                      <p className="text-sm text-gray-600">
                        {agence.adresse} • {agence.Region?.nom_region || 'N/A'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveAgence(agence.code_agence)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      title="Dissocier cette agence"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageAgencesModal;
