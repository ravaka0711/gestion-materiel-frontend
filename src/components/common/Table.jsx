import { useState } from 'react'
import { Edit, Trash2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * COMPOSANT TABLE RÉUTILISABLE
 * 
 * Fonctionnalités :
 * - Affichage des données en tableau
 * - Tri par colonne (ASC/DESC)
 * - Pagination (10, 25, 50 items par page)
 * - Actions par ligne (Modifier, Supprimer)
 * - Rendu personnalisé par colonne
 * - État de chargement avec skeleton
 * - Message si aucune donnée
 * - Responsive : scroll horizontal sur mobile
 * 
 * Props :
 * - columns: array - Configuration des colonnes
 *   Exemple: [
 *     { key: 'name', label: 'Nom', sortable: true },
 *     { key: 'email', label: 'Email', sortable: true },
 *     { 
 *       key: 'status', 
 *       label: 'Statut', 
 *       render: (value, row) => <Badge>{value}</Badge> 
 *     }
 *   ]
 * - data: array - Données à afficher
 * - onEdit: function - Callback pour édition (row) => {}
 * - onDelete: function - Callback pour suppression (row) => {}
 * - loading: boolean - État de chargement
 * - itemsPerPage: number - Nombre d'items par page (défaut: 10)
 * - emptyMessage: string - Message si aucune donnée
 * - showActions: boolean - Afficher les actions (défaut: true)
 */

export default function Table({
  columns,
  data,
  onEdit,
  onDelete,
  loading = false,
  itemsPerPage = 10,
  emptyMessage = 'Aucune donnée disponible',
  showActions = true
}) {
  // ==================== ÉTATS ====================
  
  // Colonne actuellement triée
  const [sortKey, setSortKey] = useState(null)
  
  // Ordre de tri : 'asc' (croissant) ou 'desc' (décroissant)
  const [sortOrder, setSortOrder] = useState('asc')
  
  // Page actuelle (commence à 1)
  const [currentPage, setCurrentPage] = useState(1)
  
  // Nombre d'items par page
  const [perPage, setPerPage] = useState(itemsPerPage)

  // ==================== TRI ====================
  
  /**
   * Gérer le clic sur l'en-tête d'une colonne pour trier
   * - Si on clique sur la même colonne : inverser l'ordre
   * - Si on clique sur une nouvelle colonne : trier par ordre croissant
   */
  const handleSort = (key) => {
    if (sortKey === key) {
      // Même colonne : inverser l'ordre
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // Nouvelle colonne : trier en ordre croissant
      setSortKey(key)
      setSortOrder('asc')
    }
    // Retourner à la première page après tri
    setCurrentPage(1)
  }

  /**
   * Trier les données selon la colonne et l'ordre sélectionnés
   */
  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0
    
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    
    // Gérer les valeurs nulles/undefined
    if (aVal === null || aVal === undefined) return 1
    if (bVal === null || bVal === undefined) return -1
    
    // Comparaison pour les nombres
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
    }
    
    // Comparaison pour les chaînes (insensible à la casse)
    const aStr = String(aVal).toLowerCase()
    const bStr = String(bVal).toLowerCase()
    
    if (aStr < bStr) return sortOrder === 'asc' ? -1 : 1
    if (aStr > bStr) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  // ==================== PAGINATION ====================
  
  // Calculer le nombre total de pages
  const totalPages = Math.ceil(sortedData.length / perPage)
  
  // Calculer les indices de début et fin pour la page actuelle
  const startIndex = (currentPage - 1) * perPage
  const endIndex = startIndex + perPage
  
  // Extraire les données pour la page actuelle
  const paginatedData = sortedData.slice(startIndex, endIndex)

  /**
   * Changer le nombre d'items par page
   * Retourne automatiquement à la page 1
   */
  const handlePerPageChange = (newPerPage) => {
    setPerPage(newPerPage)
    setCurrentPage(1)
  }

  /**
   * Aller à la page précédente
   */
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1))
  }

  /**
   * Aller à la page suivante
   */
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1))
  }

  // ==================== RENDU ====================

  // Affichage pendant le chargement
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Chargement des données...</p>
        </div>
      </div>
    )
  }

  // Affichage si aucune donnée
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {emptyMessage}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      {/* Table responsive avec scroll horizontal */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* En-tête du tableau */}
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {column.sortable ? (
                    // Colonne triable : afficher un bouton avec icône
                    <button
                      onClick={() => handleSort(column.key)}
                      className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-white transition-colors"
                    >
                      {column.label}
                      {sortKey === column.key && (
                        sortOrder === 'asc' ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  ) : (
                    // Colonne non triable : afficher le label simple
                    column.label
                  )}
                </th>
              ))}
              {/* Colonne Actions si activée */}
              {showActions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Corps du tableau */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.map((row, rowIndex) => (
              <tr 
                key={row.id || rowIndex}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {columns.map((column) => (
                  <td 
                    key={column.key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                  >
                    {/* Si la colonne a une fonction render personnalisée, l'utiliser */}
                    {/* Sinon, afficher la valeur directement */}
                    {column.render 
                      ? column.render(row[column.key], row)
                      : row[column.key]
                    }
                  </td>
                ))}
                
                {/* Boutons d'actions */}
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {/* Bouton Modifier */}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Modifier"
                          type="button"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      )}
                      
                      {/* Bouton Supprimer */}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Supprimer"
                          type="button"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Informations et sélecteur d'items par page */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Affichage de {startIndex + 1} à {Math.min(endIndex, data.length)} sur {data.length} résultat{data.length > 1 ? 's' : ''}
            </div>
            
            {/* Sélecteur d'items par page */}
            <select
              value={perPage}
              onChange={(e) => handlePerPageChange(Number(e.target.value))}
              className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10 par page</option>
              <option value={25}>25 par page</option>
              <option value={50}>50 par page</option>
              <option value={100}>100 par page</option>
            </select>
          </div>

          {/* Boutons de navigation */}
          <div className="flex items-center gap-2">
            {/* Bouton Précédent */}
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-lg bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              type="button"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Indicateur de page */}
            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} / {totalPages}
            </div>

            {/* Bouton Suivant */}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-2 rounded-lg bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              type="button"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}