import { Edit, Trash2, Building2 } from 'lucide-react';


const LogicielTable = ({ logiciels, onEdit, onDelete, onManageAgences }) => {
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
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


        /* Largeurs des colonnes */
        .header-table th:nth-child(1),
        .body-table td:nth-child(1) {
          width: 100px;
        }
        
        .header-table th:nth-child(2),
        .body-table td:nth-child(2) {
          width: 400px;
        }
        
        .header-table th:nth-child(3),
        .body-table td:nth-child(3) {
          width: 180px;
        }
        
        .header-table th:nth-child(4),
        .body-table td:nth-child(4) {
          width: 220px;
        }
        
        .header-table th:nth-child(5),
        .body-table td:nth-child(5) {
          width: 180px;
        }
      `}</style>


      <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* EN-TÊTE FIXE */}
        <div className="overflow-hidden">
          <table className="header-table min-w-full table-fixed">
            <thead className="bg-gray-100 dark:bg-gray-700/50">
              <tr className="border-b border-gray-200 dark:border-gray-600">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  NOM DU LOGICIEL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  VERSION
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  DATE D'INSTALLATION
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
          </table>
        </div>


        {/* CORPS SCROLLABLE - S'adapte au contenu */}
        <div 
          className="table-scroll-body" 
          style={{ 
            maxHeight: '400px',
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
          <table className="body-table min-w-full table-fixed">
            <tbody className="bg-white dark:bg-gray-800/30 divide-y divide-gray-200 dark:divide-gray-700">
              {logiciels.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Aucun logiciel trouvé
                  </td>
                </tr>
              ) : (
                logiciels.map((logiciel) => (
                  <tr key={logiciel.id_logiciel} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {logiciel.id_logiciel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {logiciel.nom_logiciel || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {logiciel.version || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {formatDate(logiciel.date_installation)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onManageAgences(logiciel)}
                        className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 mr-3 inline-flex items-center transition-colors"
                        title="Gérer les agences"
                      >
                        <Building2 size={18} />
                      </button>
                      
                      <button
                        onClick={() => onEdit(logiciel)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mr-3 inline-flex items-center transition-colors"
                        title="Modifier"
                      >
                        <Edit size={18} />
                      </button>
                      
                      <button
                        onClick={() => onDelete(logiciel)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 inline-flex items-center transition-colors"
                        title="Supprimer"
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


export default LogicielTable;
