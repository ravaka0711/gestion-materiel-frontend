import { Edit, Trash2, Eye } from 'lucide-react';

const MaintenanceTable = ({ maintenances, onEdit, onDelete, onView }) => {
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
    <>
      <style>{`
        /* Scrollbar pour mode clair */
        .table-scroll-body::-webkit-scrollbar {
          width: 8px;
        }
        
        .table-scroll-body::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        
        .table-scroll-body::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        
        .table-scroll-body::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Scrollbar pour mode dark */
        .dark .table-scroll-body::-webkit-scrollbar-track {
          background: #1e293b;
        }
        
        .dark .table-scroll-body::-webkit-scrollbar-thumb {
          background: #475569;
        }
        
        .dark .table-scroll-body::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }

        .table-scroll-body {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }

        .dark .table-scroll-body {
          scrollbar-color: #475569 #1e293b;
        }

        /* Largeurs des colonnes - Header et Body synchronisés */
        .header-table th:nth-child(1),
        .body-table td:nth-child(1) {
          width: 80px;
        }
        
        .header-table th:nth-child(2),
        .body-table td:nth-child(2) {
          width: 130px;
        }
        
        .header-table th:nth-child(3),
        .body-table td:nth-child(3) {
          width: 140px;
        }
        
        .header-table th:nth-child(4),
        .body-table td:nth-child(4) {
          width: 180px;
        }
        
        .header-table th:nth-child(5),
        .body-table td:nth-child(5) {
          width: 230px;
        }
        
        .header-table th:nth-child(6),
        .body-table td:nth-child(6) {
          width: 180px;
        }
        
        .header-table th:nth-child(7),
        .body-table td:nth-child(7) {
          width: 120px;
        }
        
        .header-table th:nth-child(8),
        .body-table td:nth-child(8) {
          width: 140px;
        }
      `}</style>

      <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* EN-TÊTE FIXE */}
        <div className="overflow-hidden">
          <table className="header-table min-w-full table-fixed">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr className="border-b border-gray-200 dark:border-gray-600">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Date début
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Agence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Matériel/Logiciel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Technicien
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
          </table>
        </div>

        {/* CORPS SCROLLABLE */}
        <div 
          className="table-scroll-body" 
          style={{ 
            maxHeight: '380px',
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
          <table className="body-table min-w-full table-fixed">
            <tbody className="bg-white dark:bg-gray-800/30 divide-y divide-gray-200 dark:divide-gray-700">
              {maintenances.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center">
                      <Eye className="mb-2 text-gray-400 dark:text-gray-500" size={48} />
                      <p>Aucune maintenance trouvée</p>
                    </div>
                  </td>
                </tr>
              ) : (
                maintenances.map((maintenance) => (
                  <tr 
                    key={maintenance.id_maintenance} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {maintenance.id_maintenance}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                      {formatDate(maintenance.date_debut)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(maintenance.type_intervention)}`}>
                        {maintenance.type_intervention}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                      {maintenance.Agence?.nom_agence || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                      {maintenance.Materiel ? (
                        <div>
                          <p className="font-medium"> {maintenance.Materiel.nom_materiel}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{maintenance.Materiel.numero_serie}</p>
                        </div>
                      ) : maintenance.Logiciel ? (
                        <div>
                          <p className="font-medium">[Package] {maintenance.Logiciel.nom_logiciel}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">v{maintenance.Logiciel.version}</p>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                      {maintenance.Utilisateur ? (
                        <div>
                          <p className="font-medium">{maintenance.Utilisateur.nom} {maintenance.Utilisateur.prenom}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{maintenance.matricule}</p>
                        </div>
                      ) : (
                        maintenance.matricule || '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(maintenance.status)}`}>
                        {maintenance.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MaintenanceTable;
