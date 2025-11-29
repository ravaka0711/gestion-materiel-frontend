import { useState, useEffect } from 'react'
import { Plus, Search, RefreshCw } from 'lucide-react'
import LogicielTable from '../tables/LogicielTable'
import LogicielForm from '../forms/LogicielForm'
import ConfirmDialog from '../common/ConfirmDialog'
import ManageAgencesModal from '../modals/ManageAgencesModal'
import { 
  getLogiciels, 
  createLogiciel, 
  updateLogiciel, 
  deleteLogiciel,
  getAgencesByLogiciel,
  addAgenceToLogiciel,
  removeAgenceFromLogiciel,
  getAgences
} from '../../services/api'

const LogicielPage = () => {
  const [logiciels, setLogiciels] = useState([]);
  const [filteredLogiciels, setFilteredLogiciels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedLogiciel, setSelectedLogiciel] = useState(null);
  const [notification, setNotification] = useState(null);
  
  const [showManageAgences, setShowManageAgences] = useState(false);
  const [selectedLogicielForAgences, setSelectedLogicielForAgences] = useState(null);
  const [agencesForLogiciel, setAgencesForLogiciel] = useState([]);
  const [allAgences, setAllAgences] = useState([]);

  const fetchLogiciels = async () => {
    setLoading(true);
    try {
      const data = await getLogiciels();
      const sortedData = [...data].sort((a, b) => b.id_logiciel - a.id_logiciel);
      setLogiciels(sortedData);
      setFilteredLogiciels(sortedData);
    } catch (error) {
      showNotification('Erreur lors du chargement des logiciels', 'error');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogiciels();
  }, []);

  useEffect(() => {
    const filtered = logiciels.filter(logiciel => {
      if (!searchTerm) return true;
      
      const searchValue = searchTerm.trim();
      const logicielId = String(logiciel.id_logiciel);
      const isPureNumber = /^\d+$/.test(searchValue);
      
      if (isPureNumber) {
        return logicielId === searchValue;
      } else {
        const matchesName = logiciel.nom_logiciel?.toLowerCase().includes(searchValue.toLowerCase());
        const matchesVersion = String(logiciel.version || '').toLowerCase().includes(searchValue.toLowerCase());
        return matchesName || matchesVersion;
      }
    });
    
    setFilteredLogiciels(filtered);
  }, [searchTerm, logiciels]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedLogiciel) {
        await updateLogiciel(selectedLogiciel.id_logiciel, formData);
        showNotification('Logiciel mis à jour avec succès');
      } else {
        await createLogiciel(formData);
        showNotification('Logiciel créé avec succès');
      }

      setShowForm(false);
      setSelectedLogiciel(null);
      fetchLogiciels();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Une erreur est survenue';
      showNotification(errorMsg, 'error');
      console.error('Erreur:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteLogiciel(selectedLogiciel.id_logiciel);
      showNotification('Logiciel supprimé avec succès');
      setShowDeleteDialog(false);
      setSelectedLogiciel(null);
      fetchLogiciels();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erreur lors de la suppression';
      showNotification(errorMsg, 'error');
      console.error('Erreur:', error);
    }
  };

  const handleEdit = (logiciel) => {
    setSelectedLogiciel(logiciel);
    setShowForm(true);
  };

  const handleDeleteClick = (logiciel) => {
    setSelectedLogiciel(logiciel);
    setShowDeleteDialog(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedLogiciel(null);
  };

  const handleManageAgences = async (logiciel) => {
    setSelectedLogicielForAgences(logiciel);
    setLoading(true);
    try {
      const [agencesData, allAgencesData] = await Promise.all([
        getAgencesByLogiciel(logiciel.id_logiciel),
        getAgences()
      ]);
      setAgencesForLogiciel(agencesData.agences || []);
      setAllAgences(allAgencesData);
      setShowManageAgences(true);
    } catch (error) {
      showNotification('Erreur lors du chargement des agences', 'error');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgenceAdded = async (code_agence) => {
    try {
      await addAgenceToLogiciel(code_agence, selectedLogicielForAgences.id_logiciel);
      showNotification('Agence associée avec succès');
      
      const data = await getAgencesByLogiciel(selectedLogicielForAgences.id_logiciel);
      setAgencesForLogiciel(data.agences || []);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erreur lors de l\'association';
      showNotification(errorMsg, 'error');
      console.error('Erreur:', error);
    }
  };

  const handleAgenceRemoved = async (code_agence) => {
    try {
      await removeAgenceFromLogiciel(code_agence, selectedLogicielForAgences.id_logiciel);
      showNotification('Agence dissociée avec succès');
      
      const data = await getAgencesByLogiciel(selectedLogicielForAgences.id_logiciel);
      setAgencesForLogiciel(data.agences || []);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erreur lors de la dissociation';
      showNotification(errorMsg, 'error');
      console.error('Erreur:', error);
    }
  };

  return (
    <>
      <style>{`
        @keyframes slide-in-right {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>

      {/* Notification */}
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

      {/* Conteneur principal avec espacement réduit */}
      <div 
        className="h-screen bg-gray-50 dark:bg-gray-900"
        style={{ overflow: 'hidden' }}
      >
        <div className="h-full flex flex-col p-3">
          
          {/* En-tête compact */}
          <div className="flex items-center gap-2 mb-2 flex-shrink-0">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Gestion des Logiciels
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {logiciels.length} logiciel{logiciels.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Barre d'actions compacte */}
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-2 mb-2 border border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={fetchLogiciels}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
                >
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                  Actualiser
                </button>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus size={14} />
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          {/* Statistiques compactes */}
          <div className="grid grid-cols-3 gap-2 mb-2 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Total logiciels</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{logiciels.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Résultats affichés</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{filteredLogiciels.length}</p>
            </div>
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-2 border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">Recherche active</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{searchTerm ? 'Oui' : 'Non'}</p>
            </div>
          </div>

          {/* Table - Prend l'espace restant */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {loading ? (
              <div className="h-full bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center justify-center">
                <RefreshCw className="animate-spin mb-4 text-blue-600 dark:text-blue-400" size={36} />
                <p className="text-sm text-gray-600 dark:text-gray-400">Chargement des logiciels...</p>
              </div>
            ) : (
              <LogicielTable
                logiciels={filteredLogiciels}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onManageAgences={handleManageAgences}
              />
            )}
          </div>

          {showForm && (
            <LogicielForm
              logiciel={selectedLogiciel}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          )}

          {showDeleteDialog && selectedLogiciel && (
            <ConfirmDialog
              isOpen={showDeleteDialog}
              onClose={() => {
                setShowDeleteDialog(false);
                setSelectedLogiciel(null);
              }}
              onConfirm={handleDelete}
              title="Confirmer la suppression"
              message={
                <>
                  Êtes-vous sûr de vouloir supprimer ce logiciel ?
                  <span className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded block">
                    <span className="text-sm text-gray-900 dark:text-gray-300 block">
                      <span className="font-medium">ID:</span> {selectedLogiciel.id_logiciel}
                    </span>
                    <span className="text-sm text-gray-900 dark:text-gray-300 block">
                      <span className="font-medium">Nom:</span> {selectedLogiciel.nom_logiciel}
                    </span>
                    {selectedLogiciel.version && (
                      <span className="text-sm text-gray-900 dark:text-gray-300 block">
                        <span className="font-medium">Version:</span> {selectedLogiciel.version}
                      </span>
                    )}
                  </span>
                </>
              }
              confirmText="Supprimer"
              type="danger"
            />
          )}

          {showManageAgences && selectedLogicielForAgences && (
            <ManageAgencesModal
              logiciel={selectedLogicielForAgences}
              currentAgences={agencesForLogiciel}
              availableAgences={allAgences}
              onClose={() => {
                setShowManageAgences(false);
                setSelectedLogicielForAgences(null);
              }}
              onAgenceAdded={handleAgenceAdded}
              onAgenceRemoved={handleAgenceRemoved}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default LogicielPage;
