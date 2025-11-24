import { X } from 'lucide-react';

const MaintenanceViewDialog = ({ maintenance, onClose }) => {
  if (!maintenance) return null;

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'réparé':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'non réparé':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'en cours':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'par mission':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'en directe':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'à distance':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========== HEADER ========== */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>📋</span>
              Détails de la maintenance
            </h2>
            <p className="text-sm text-blue-100 mt-1">
              Référence: {maintenance.id_maintenance}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-800 rounded-lg transition-colors text-white"
            title="Fermer"
          >
            <X size={24} />
          </button>
        </div>

        {/* ========== CONTENT ========== */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-180px)] bg-gray-50 dark:bg-gray-900">
          
          {/* Badges Status et Type */}
          <div className="flex gap-3 mb-6">
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                Status
              </label>
              <span className={`px-4 py-2 text-sm font-semibold rounded-lg ${getStatusColor(maintenance.status)}`}>
                {maintenance.status}
              </span>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                Type d'intervention
              </label>
              <span className={`px-4 py-2 text-sm font-semibold rounded-lg ${getTypeColor(maintenance.type_intervention)}`}>
                {maintenance.type_intervention}
              </span>
            </div>
          </div>

          {/* Grid 2 colonnes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* ========== COLONNE GAUCHE ========== */}
            <div className="space-y-6">
              
              {/* Dates */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  📅 Dates
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
                      Date début
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium mt-1">
                      {formatDate(maintenance.date_debut)}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
                      Date fin
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium mt-1">
                      {maintenance.date_fin ? formatDate(maintenance.date_fin) : '🔄 En cours'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Localisation */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  📍 Localisation
                </h3>
                
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
                    Agence
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium mt-1">
                    {maintenance.Agence?.nom_agence || '-'}
                  </p>
                </div>
              </div>

              {/* Équipement */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  🔧 Équipement
                </h3>
                
                {maintenance.Materiel ? (
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      📦 {maintenance.Materiel.nom_materiel}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      N° Série: <span className="font-mono">{maintenance.Materiel.numero_serie}</span>
                    </p>
                  </div>
                ) : maintenance.Logiciel ? (
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      💻 {maintenance.Logiciel.nom_logiciel}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Version: {maintenance.Logiciel.version}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">Aucun équipement spécifié</p>
                )}
              </div>
            </div>

            {/* ========== COLONNE DROITE ========== */}
            <div className="space-y-6">
              
              {/* Technicien */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  👤 Technicien
                </h3>
                
                {maintenance.Utilisateur ? (
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium text-lg">
                      {maintenance.Utilisateur.nom} {maintenance.Utilisateur.prenom}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Matricule: <span className="font-mono">{maintenance.matricule}</span>
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-900 dark:text-white">
                    Matricule: {maintenance.matricule || '-'}
                  </p>
                )}
              </div>

              {/* Détails techniques */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  ⚙️ Détails techniques
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
                      N° OR
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium mt-1">
                      {maintenance.numero_or || '-'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
                      Outils utilisés
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium mt-1">
                      {maintenance.outils || '-'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
                      Solution appliquée
                    </label>
                    <p className="text-gray-900 dark:text-white font-medium mt-1">
                      {maintenance.solution_appliquee || '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========== DESCRIPTION (Pleine largeur) ========== */}
          {maintenance.description && (
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                📝 Description
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {maintenance.description}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ========== FOOTER ========== */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceViewDialog;
