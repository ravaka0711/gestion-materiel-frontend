import { useState, useEffect } from 'react';
import { Plus, Search, RefreshCw, Wrench, X } from 'lucide-react';
import MaintenanceTable from '../tables/MaintenanceTable';
import MaintenanceForm from '../forms/MaintenanceForm';
import ConfirmDialog from '../common/ConfirmDialog';
import MaintenanceViewDialog from '../dialogs/MaintenanceViewDialog';
import {
    getMaintenances,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance
} from '../../services/api';

const MaintenancesPage = () => {
    const [maintenances, setMaintenances] = useState([]);
    const [filteredMaintenances, setFilteredMaintenances] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [dateDebut, setDateDebut] = useState('');
    const [dateFin, setDateFin] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showViewDialog, setShowViewDialog] = useState(false);
    const [selectedMaintenance, setSelectedMaintenance] = useState(null);
    const [notification, setNotification] = useState(null);

    const fetchMaintenances = async () => {
        setLoading(true);
        try {
            const data = await getMaintenances();
            setMaintenances(data);
            setFilteredMaintenances(data);
        } catch (error) {
            showNotification('Erreur lors du chargement des maintenances', 'error');
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaintenances();
    }, []);

    useEffect(() => {
        let filtered = maintenances;

        if (searchTerm) {
            filtered = filtered.filter(maintenance =>
                maintenance.id_maintenance.toString().includes(searchTerm) ||
                maintenance.Agence?.nom_agence?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                maintenance.Materiel?.nom_materiel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                maintenance.Logiciel?.nom_logiciel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                maintenance.Utilisateur?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                maintenance.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(m => m.status === statusFilter);
        }

        if (typeFilter !== 'all') {
            filtered = filtered.filter(m => m.type_intervention === typeFilter);
        }

        if (dateDebut && dateFin) {
            const debut = new Date(dateDebut);
            debut.setHours(0, 0, 0, 0);
            const fin = new Date(dateFin);
            fin.setHours(23, 59, 59, 999);
            filtered = filtered.filter(m => {
                const dateM = new Date(m.date_debut);
                return dateM >= debut && dateM <= fin;
            });
        } else if (dateDebut) {
            const debut = new Date(dateDebut);
            debut.setHours(0, 0, 0, 0);
            filtered = filtered.filter(m => {
                const dateM = new Date(m.date_debut);
                return dateM >= debut;
            });
        } else if (dateFin) {
            const fin = new Date(dateFin);
            fin.setHours(23, 59, 59, 999);
            filtered = filtered.filter(m => {
                const dateM = new Date(m.date_debut);
                return dateM <= fin;
            });
        }

        setFilteredMaintenances(filtered);
    }, [searchTerm, statusFilter, typeFilter, dateDebut, dateFin, maintenances]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSubmit = async (formData) => {
        try {
            if (selectedMaintenance) {
                await updateMaintenance(selectedMaintenance.id_maintenance, formData);
                showNotification('Maintenance mise à jour avec succès');
            } else {
                await createMaintenance(formData);
                showNotification('Maintenance créée avec succès');
            }
            setShowForm(false);
            setSelectedMaintenance(null);
            fetchMaintenances();
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Une erreur est survenue';
            showNotification(errorMsg, 'error');
            console.error('Erreur:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteMaintenance(selectedMaintenance.id_maintenance);
            showNotification('Maintenance supprimée avec succès');
            setShowDeleteDialog(false);
            setSelectedMaintenance(null);
            fetchMaintenances();
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Erreur lors de la suppression';
            showNotification(errorMsg, 'error');
            console.error('Erreur:', error);
        }
    };

    const handleEdit = (maintenance) => {
        setSelectedMaintenance(maintenance);
        setShowForm(true);
    };

    const handleDeleteClick = (maintenance) => {
        setSelectedMaintenance(maintenance);
        setShowDeleteDialog(true);
    };

    const handleView = (maintenance) => {
        console.log('👁️ Ouverture détails maintenance:', maintenance);
        setSelectedMaintenance(maintenance);
        setShowViewDialog(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setSelectedMaintenance(null);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setTypeFilter('all');
        setDateDebut('');
        setDateFin('');
    };

    const stats = {
        total: maintenances.length,
        enCours: maintenances.filter(m => m.status === 'en cours').length,
        repare: maintenances.filter(m => m.status === 'réparé').length,
        nonRepare: maintenances.filter(m => m.status === 'non réparé').length,
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

            {notification && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
                    <div className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${notification.type === 'success'
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
                <div className="h-full flex flex-col p-4 gap-4">

                    {/* En-tête */}
                    <div className="flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 p-3 rounded-lg">
                                <Wrench className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Gestion des Maintenances
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {filteredMaintenances.length} / {maintenances.length} maintenance{maintenances.length > 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={16} />
                            Ajouter
                        </button>
                    </div>

                    {/* Barre d'actions */}
                    <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700 flex-shrink-0">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                                <div className="relative lg:w-80">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Rechercher par ID, agence, matériel..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="flex items-center justify-center gap-2 flex-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                        📅 Du:
                                    </label>
                                    <input
                                        type="date"
                                        value={dateDebut}
                                        onChange={(e) => setDateDebut(e.target.value)}
                                        className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                        Au:
                                    </label>
                                    <input
                                        type="date"
                                        value={dateFin}
                                        onChange={(e) => setDateFin(e.target.value)}
                                        min={dateDebut}
                                        className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <button
                                    onClick={fetchMaintenances}
                                    disabled={loading}
                                    className="flex items-center gap-2 px-4 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors whitespace-nowrap"
                                >
                                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                                    Actualiser
                                </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">Tous les status</option>
                                    <option value="en cours">En cours</option>
                                    <option value="réparé">Réparé</option>
                                    <option value="non réparé">Non réparé</option>
                                </select>

                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">Tous les types</option>
                                    <option value="en directe">En directe</option>
                                    <option value="par mission">Par mission</option>
                                    <option value="à distance">À distance</option>
                                </select>

                                {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || dateDebut || dateFin) && (
                                    <button
                                        onClick={resetFilters}
                                        className="flex items-center gap-1 px-3 py-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-md transition-colors ml-auto"
                                        title="Réinitialiser tous les filtres"
                                    >
                                        <X size={16} />
                                        Tout effacer
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 flex-shrink-0">
                        <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total maintenances</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">En cours</p>
                            <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{stats.enCours}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Réparés</p>
                            <p className="text-xl font-bold text-green-600 dark:text-green-400">{stats.repare}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Non réparés</p>
                            <p className="text-xl font-bold text-red-600 dark:text-red-400">{stats.nonRepare}</p>
                        </div>
                    </div>

                    {/* Table - CORRECTION ICI : overflow-hidden sur le conteneur */}
                    <div className="flex-1 overflow-hidden">
                        {loading ? (
                            <div className="h-full bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center justify-center">
                                <RefreshCw className="animate-spin mb-4 text-blue-600 dark:text-blue-400" size={36} />
                                <p className="text-sm text-gray-600 dark:text-gray-400">Chargement des maintenances...</p>
                            </div>
                        ) : (
                            <MaintenanceTable
                                maintenances={filteredMaintenances}
                                onEdit={handleEdit}
                                onDelete={handleDeleteClick}
                                onView={handleView}
                            />
                        )}
                    </div>

                </div>
            </div>

            {showForm && (
                <MaintenanceForm
                    maintenance={selectedMaintenance}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            )}

            {showViewDialog && selectedMaintenance && (
                <MaintenanceViewDialog
                    maintenance={selectedMaintenance}
                    onClose={() => {
                        setShowViewDialog(false);
                        setSelectedMaintenance(null);
                    }}
                />
            )}

            {showDeleteDialog && selectedMaintenance && (
                <ConfirmDialog
                    isOpen={showDeleteDialog}
                    onClose={() => {
                        setShowDeleteDialog(false);
                        setSelectedMaintenance(null);
                    }}
                    onConfirm={handleDelete}
                    title="Confirmer la suppression"
                    message={
                        <>
                            Êtes-vous sûr de vouloir supprimer cette maintenance ?
                            <span className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded block">
                                <span className="text-sm text-gray-900 dark:text-gray-300 block">
                                    <span className="font-medium">ID:</span> {selectedMaintenance.id_maintenance}
                                </span>
                                <span className="text-sm text-gray-900 dark:text-gray-300 block">
                                    <span className="font-medium">Type:</span> {selectedMaintenance.type_intervention}
                                </span>
                                <span className="text-sm text-gray-900 dark:text-gray-300 block">
                                    <span className="font-medium">Agence:</span> {selectedMaintenance.Agence?.nom_agence}
                                </span>
                                <span className="text-sm text-gray-900 dark:text-gray-300 block">
                                    <span className="font-medium">Status:</span> {selectedMaintenance.status}
                                </span>
                            </span>
                        </>
                    }
                    confirmText="Supprimer"
                    type="danger"
                />
            )}
        </>
    );
};

export default MaintenancesPage;