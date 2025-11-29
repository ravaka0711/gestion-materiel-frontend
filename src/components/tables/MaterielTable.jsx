import { Edit, Trash2, Package } from 'lucide-react';

const MaterielTable = ({ materiels, onEdit, onDelete }) => {
  const formatDate = (date) => date ? new Date(date).toLocaleDateString('fr-FR') : '-';

  const getEtatColor = (etat) => {
    switch (etat) {
      case 'utilisable':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'en panne':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'non utilisable':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
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
            <col style={{ width: "48px" }} />
            <col style={{ width: "110px" }} />
            <col style={{ width: "170px" }} />
            <col style={{ width: "170px" }} />
            <col style={{ width: "170px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "120px" }} />
            {onEdit && onDelete && <col style={{ width: "80px" }} />}
          </colgroup>
          <thead>
            <tr>
              <th className="px-3 py-3 text-center font-bold bg-gray-50 dark:bg-gray-700/80 text-gray-900 dark:text-gray-200">ID</th>
              <th className="px-3 py-3 text-center font-bold bg-gray-50 dark:bg-gray-700/80 text-gray-900 dark:text-gray-200">N° Série</th>
              <th className="px-4 py-3 text-center font-bold bg-gray-50 dark:bg-gray-700/80 text-gray-900 dark:text-gray-200">Désignation</th>
              <th className="px-4 py-3 text-center font-bold bg-gray-50 dark:bg-gray-700/80 text-gray-900 dark:text-gray-200">Marque/Modèle</th>
              <th className="px-4 py-3 text-center font-bold bg-gray-50 dark:bg-gray-700/80 text-gray-900 dark:text-gray-200">Agence</th>
              <th className="px-3 py-3 text-center font-bold bg-gray-50 dark:bg-gray-700/80 text-gray-900 dark:text-gray-200">État</th>
              <th className="px-3 py-3 text-center font-bold bg-gray-50 dark:bg-gray-700/80 text-gray-900 dark:text-gray-200">Date acquisition</th>
              {onEdit && onDelete && (
                <th className="px-4 py-3 text-right font-bold bg-gray-50 dark:bg-gray-700/80 text-gray-900 dark:text-gray-200">Actions</th>
              )}
            </tr>
          </thead>
        </table>
      </div>

      {/* TABLE BODY SCROLLABLE avec padding en bas */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ maxHeight: 'calc(100vh - 360px)' }}>
        <table className="min-w-full table-fixed">
          <colgroup>
            <col style={{ width: "48px" }} />
            <col style={{ width: "110px" }} />
            <col style={{ width: "170px" }} />
            <col style={{ width: "170px" }} />
            <col style={{ width: "170px" }} />
            <col style={{ width: "100px" }} />
            <col style={{ width: "120px" }} />
            {onEdit && onDelete && <col style={{ width: "80px" }} />}
          </colgroup>
          <tbody className="bg-white dark:bg-gray-800/30 divide-y divide-gray-200 dark:divide-gray-700">
            {materiels.length === 0 ? (
              <tr>
                <td colSpan={onEdit && onDelete ? "8" : "7"} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  <Package className="mx-auto mb-2 text-gray-400 dark:text-gray-500" size={48} />
                  <p>Aucun matériel trouvé</p>
                </td>
              </tr>
            ) : (
              <>
                {materiels.map((materiel) => (
                  <tr key={materiel.id_materiel} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-3 py-4 text-center dark:text-gray-200">{materiel.id_materiel}</td>
                    <td className="px-3 py-4 text-center"><span className="font-mono text-xs text-gray-600 dark:text-gray-400">{materiel.numero_serie || '-'}</span></td>
                    <td className="px-4 py-4 text-center dark:text-gray-200">{materiel.nom_materiel || '-'}</td>
                    <td className="px-4 py-4 text-center">
                      <p className="font-medium dark:text-gray-200">{materiel.marque || '-'}</p>
                      {materiel.modele && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">{materiel.modele}</p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center dark:text-gray-200">{materiel.Agence?.nom_agence || '-'}</td>
                    <td className="px-3 py-4 text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEtatColor(materiel.etat)}`}>
                        {materiel.etat}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-center dark:text-gray-200">{formatDate(materiel.date_acquisition)}</td>
                    {onEdit && onDelete && (
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => onEdit(materiel)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mr-3 inline-flex items-center transition-colors"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => onDelete(materiel)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 inline-flex items-center transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {/* Ligne invisible pour ajouter de l'espace en bas */}
                <tr>
                  <td colSpan={onEdit && onDelete ? "8" : "7"} className="bg-transparent"></td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaterielTable;
