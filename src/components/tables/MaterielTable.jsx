import { Edit, Trash2, Package } from 'lucide-react';

const MaterielTable = ({ materiels, onEdit, onDelete }) => {
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  };

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
    <>
      <style>{/* ... same as before ... */}</style>
      <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* EN-TÊTE FIXE */}
        <div className="overflow-hidden">
          <table className="header-table min-w-full table-fixed">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr className="border-b border-gray-200 dark:border-gray-600">
                <th className="px-6 py-3 ...">ID</th>
                <th className="px-6 py-3 ...">N° Série</th>
                <th className="px-6 py-3 ...">Désignation</th>
                <th className="px-6 py-3 ...">Marque/Modèle</th>
                <th className="px-6 py-3 ...">Agence</th>
                <th className="px-6 py-3 ...">État</th>
                <th className="px-6 py-3 ...">Date acquisition</th>
                {/* Afficher Actions si et seulement si props sont fournis */}
                {onEdit && onDelete && (
                  <th className="px-6 py-3 text-right ...">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
          </table>
        </div>

        {/* CORPS SCROLLABLE */}
        <div className="table-scroll-body" style={{ maxHeight: '400px', overflowY: 'auto', overflowX: 'hidden' }}>
          <table className="body-table min-w-full table-fixed">
            <tbody className="bg-white dark:bg-gray-800/30 divide-y divide-gray-200 dark:divide-gray-700">
              {materiels.length === 0 ? (
                <tr>
                  <td colSpan={onEdit && onDelete ? "8" : "7"} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    <Package className="mx-auto mb-2 text-gray-400 dark:text-gray-500" size={48} />
                    <p>Aucun matériel trouvé</p>
                  </td>
                </tr>
              ) : (
                materiels.map((materiel) => (
                  <tr key={materiel.id_materiel} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 ...">{materiel.id_materiel}</td>
                    <td className="px-6 py-4 ...">
                      <span className="font-mono text-xs ...">{materiel.numero_serie || '-'}</span>
                    </td>
                    <td className="px-6 py-4 ...">{materiel.nom_materiel || '-'}</td>
                    <td className="px-6 py-4 ...">
                      <div>
                        <p className="font-medium">{materiel.marque || '-'}</p>
                        {materiel.modele && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">{materiel.modele}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 ...">{materiel.Agence?.nom_agence || '-'}</td>
                    <td className="px-6 py-4 ...">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEtatColor(materiel.etat)}`}>
                        {materiel.etat}
                      </span>
                    </td>
                    <td className="px-6 py-4 ...">{formatDate(materiel.date_acquisition)}</td>
                    {/* Actions seulement si props fournis */}
                    {onEdit && onDelete && (
                      <td className="px-6 py-4 text-right ...">
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default MaterielTable;
