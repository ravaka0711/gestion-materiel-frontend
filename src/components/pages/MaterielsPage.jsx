import { useState, useEffect } from 'react';
import { Plus, Search, RefreshCw, Package, Eye } from 'lucide-react';
import MaterielTable from '../tables/MaterielTable';
import MaterielForm from '../forms/MaterielForm';
import ConfirmDialog from '../common/ConfirmDialog';
import { 
  getMateriels, 
  createMateriel, 
  updateMateriel, 
  deleteMateriel 
} from '../../services/api';

const MaterielPage = () => {
  // Récupérer le rôle utilisateur
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isDirecteur = user.fonction === 'directeur';
  const isResponsable = user.fonction === 'responsable';

  const [materiels, setMateriels] = useState([]);
  const [filteredMateriels, setFilteredMateriels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMateriel, setSelectedMateriel] = useState(null);
  const [notification, setNotification] = useState(null);

  // Récupérer tous les matériels
  const fetchMateriels = async () => {
    setLoading(true);
    try {
      const data = await getMateriels();
      setMateriels(data);
      setFilteredMateriels(data);
    } catch (error) {
      showNotification('Erreur lors du chargement des matériels', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMateriels();
  }, []);

  // Filtrer les matériels
  useEffect(() => {
    const filtered = materiels.filter(materiel =>
      materiel.nom_materiel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      materiel.numero_serie?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      materiel.marque?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      materiel.modele?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      materiel.Agence?.nom_agence?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      materiel.id_materiel.toString().includes(searchTerm)
    );
    setFilteredMateriels(filtered);
  }, [searchTerm, materiels]);

  // Afficher une notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Créer ou mettre à jour un matériel
  const handleSubmit = async (formData) => {
    try {
      if (selectedMateriel) {
        await updateMateriel(selectedMateriel.id_materiel, formData);
        showNotification('Matériel mis à jour avec succès');
      } else {
        await createMateriel(formData);
        showNotification('Matériel créé avec succès');
      }
      setShowForm(false);
      setSelectedMateriel(null);
      fetchMateriels();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Une erreur est survenue';
      showNotification(errorMsg, 'error');
    }
  };

  // Supprimer un matériel
  const handleDelete = async () => {
    try {
      await deleteMateriel(selectedMateriel.id_materiel);
      showNotification('Matériel supprimé avec succès');
      setShowDeleteDialog(false);
      setSelectedMateriel(null);
      fetchMateriels();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erreur lors de la suppression';
      showNotification(errorMsg, 'error');
    }
  };

  // Ouvrir le formulaire pour modifier
  const handleEdit = (materiel) => {
    setSelectedMateriel(materiel);
    setShowForm(true);
  };

  // Ouvrir la dialog de suppression
  const handleDeleteClick = (materiel) => {
    setSelectedMateriel(materiel);
    setShowDeleteDialog(true);
  };

  // Fermer le formulaire
  const handleCancel = () => {
    setShowForm(false);
    setSelectedMateriel(null);
  };

  // Statistiques
  const stats = {
    total: materiels.length,
    utilisable: materiels.filter(m => m.etat === 'utilisable').length,
    enPanne: materiels.filter(m => m.etat === 'en panne').length,
    nonUtilisable: materiels.filter(m => m.etat === 'non utilisable').length,
  };

  return (
    <>
      <style>{`
        body::-webkit-scrollbar, html::-webkit-scrollbar { display: none; }
        body, html { scrollbar-width: none; -ms-overflow-style: none; overflow: hidden; }
      `}</style>
      <style>{`
        @keyframes slide-in-right {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
      `}</style>

      {/* Badge lecture seule directeur */}
      {isDirecteur}

      {/* Notification améliorée */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
            notification.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}>
            {notification.type === 'success' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {notification.message}
          </div>
        </div>
      )}

      <div className="h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        <div className="h-full flex flex-col p-2">
          {/* En-tête */}
          <div className="flex items-center gap-3 mb-4 flex-shrink-0">
            <div className="bg-blue-600 p-2.5 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isDirecteur ? "Liste des Matériels" : "Gestion des Matériels"}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {materiels.length} matériel{materiels.length > 1 ? 's' : ''} affiché{materiels.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Barre d'actions */}
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 mb-3 border border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher par nom, N° série, marque, agence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={fetchMateriels}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  Actualiser
                </button>
                {/* Bouton ajouter : uniquement pour responsable */}
                {isResponsable && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    Ajouter
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total matériels</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Utilisables</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{stats.utilisable}</p>
            </div>
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">En panne</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400">{stats.enPanne}</p>
            </div>
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Non utilisables</p>
              <p className="text-xl font-bold text-gray-600 dark:text-gray-400">{stats.nonUtilisable}</p>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {loading ? (
              <div className="h-full bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center justify-center">
                <RefreshCw className="animate-spin mb-4 text-blue-600 dark:text-blue-400" size={36} />
                <p className="text-sm text-gray-600 dark:text-gray-400">Chargement des matériels...</p>
              </div>
            ) : (
              <MaterielTable
                materiels={filteredMateriels}
                // Actions passées uniquement au responsable
                onEdit={isResponsable ? handleEdit : undefined}
                onDelete={isResponsable ? handleDeleteClick : undefined}
              />
            )}
          </div>

          {/* Formulaire visible seulement pour responsable */}
          {showForm && isResponsable && (
            <MaterielForm
              materiel={selectedMateriel}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          )}

          {/* Dialog suppression seulement pour responsable */}
          {showDeleteDialog && selectedMateriel && isResponsable && (
            <ConfirmDialog
              isOpen={showDeleteDialog}
              onClose={() => {
                setShowDeleteDialog(false);
                setSelectedMateriel(null);
              }}
              onConfirm={handleDelete}
              title="Confirmer la suppression"
              message={
                <>
                  Êtes-vous sûr de vouloir supprimer ce matériel ?
                  <span className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded block">
                    <span className="text-sm text-gray-900 dark:text-gray-300 block">
                      <span className="font-medium">ID:</span> {selectedMateriel.id_materiel}
                    </span>
                    <span className="text-sm text-gray-900 dark:text-gray-300 block">
                      <span className="font-medium">N° Série:</span> {selectedMateriel.numero_serie}
                    </span>
                    <span className="text-sm text-gray-900 dark:text-gray-300 block">
                      <span className="font-medium">Désignation:</span> {selectedMateriel.nom_materiel}
                    </span>
                    <span className="text-sm text-gray-900 dark:text-gray-300 block">
                      <span className="font-medium">Agence:</span> {selectedMateriel.Agence?.nom_agence}
                    </span>
                  </span>
                </>
              }
              confirmText="Supprimer"
              type="danger"
            />
          )}
        </div>
      </div>
    </>
  );
};
export default MaterielPage;
