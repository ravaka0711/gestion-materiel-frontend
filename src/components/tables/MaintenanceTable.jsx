import { Edit, Trash2, Eye } from 'lucide-react';

const MaintenanceTable = ({ maintenances = [], onEdit, onDelete, onView }) => {
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
    <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      {/* TABLE EN-TÊTE FIXE */}
      <div className="flex-shrink-0">
        <table className="min-w-full table-fixed">
          <colgroup>
            <col style={{ width: "60px" }} />
            <col style={{ width: "110px" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "200px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "110px" }} />
            <col style={{ width: "130px" }} />
          </colgroup>
          <thead>
            <tr>
              <th className="px-3 py-3 text-center font-bold bg-gray-50 dark:bg-gray-700/80 text-gray-900 dark:text-gray-200">ID</th>
              <th className="px-3 py-3 text-center font-bold bg-gray-50 dark:bg-gray-700/80 text-gray-900 dark:text-gray-200">Date début</th>
              <th className="px-4 py-3 text-center font-bold bg-gray-50 dark:bg-gray-700/80 text-gray-900 dark:text-gray-200">Type</th>
              <th className="px-4 py-3 text-center font-bold bg-gray-50 dark:bg-gray-700/80 text-gray-900 dark:text-gray-200">Agence</th>
              <th className="px-4 py-3 text-center font-bold bg-gray-50 dark:bg-gray-700/80 text-gray-900 dark:text-gray-200">Matériel/Logiciel</th>
              <th className="px-4 py-3 text-center font-bold bg-gray-50 dark:bg-gray-700/80 text-gray-900 dark:text-gray-200">Technicien</th>
              <th className="px-3 py-3 text-center font-bold bg-gray-50 dark:bg-gray-700/80 text-gray-900 dark:text-gray-200">Status</th>
              <th className="px-4 py-3 text-right font-bold bg-gray-50 dark:bg-gray-700/80 text-gray-900 dark:text-gray-200">Actions</th>
            </tr>
          </thead>
        </table>
      </div>

      {/* TABLE BODY SCROLLABLE avec padding en bas */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ maxHeight: 'calc(100vh - 360px)' }}>
        <table className="min-w-full table-fixed">
          <colgroup>
            <col style={{ width: "60px" }} />
            <col style={{ width: "110px" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "200px" }} />
            <col style={{ width: "150px" }} />
            <col style={{ width: "110px" }} />
            <col style={{ width: "130px" }} />
          </colgroup>
          <tbody className="bg-white dark:bg-gray-800/30 divide-y divide-gray-200 dark:divide-gray-700">
            {maintenances.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  <Eye className="mx-auto mb-2 text-gray-400 dark:text-gray-500" size={48} />
                  <p>Aucune maintenance trouvée</p>
                </td>
              </tr>
            ) : (
              <>
                {maintenances.map((maintenance) => (
                  <tr key={maintenance.id_maintenance} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-3 py-4 text-center dark:text-gray-200">{maintenance.id_maintenance}</td>
                    <td className="px-3 py-4 text-center dark:text-gray-200">{formatDate(maintenance.date_debut)}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(maintenance.type_intervention)}`}>
                        {maintenance.type_intervention}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center dark:text-gray-200">{maintenance.Agence?.nom_agence || '-'}</td>
                    <td className="px-4 py-4 text-center">
                      {maintenance.Materiel ? (
                        <div>
                          <p className="font-medium dark:text-gray-200">{maintenance.Materiel.nom_materiel}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{maintenance.Materiel.numero_serie}</p>
                        </div>
                      ) : maintenance.Logiciel ? (
                        <div>
                          <p className="font-medium dark:text-gray-200">[Package] {maintenance.Logiciel.nom_logiciel}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">v{maintenance.Logiciel.version}</p>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {maintenance.Utilisateur ? (
                        <div>
                          <p className="font-medium dark:text-gray-200">{maintenance.Utilisateur.nom} {maintenance.Utilisateur.prenom}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{maintenance.matricule}</p>
                        </div>
                      ) : (
                        maintenance.matricule || '-'
                      )}
                    </td>
                    <td className="px-3 py-4 text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(maintenance.status)}`}>
                        {maintenance.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => onView?.(maintenance)}
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 mr-3 inline-flex items-center transition-colors"
                        title="Voir détails"
                        type="button"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => onEdit?.(maintenance)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mr-3 inline-flex items-center transition-colors"
                        title="Modifier"
                        type="button"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onDelete?.(maintenance)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 inline-flex items-center transition-colors"
                        title="Supprimer"
                        type="button"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Ligne invisible pour ajouter de l'espace en bas */}
                <tr style={{ height: '40px' }}>
                  <td colSpan="8" className="bg-transparent"></td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenanceTable;